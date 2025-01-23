import numpy as np
import pandas as pd
import os
import glob as gb
import cv2
import matplotlib.pyplot as plt
import tensorflow
from tensorflow import keras
from PIL import Image
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from sklearn.metrics import accuracy_score
np.random.seed(42)

# Define dataset directory and image dimensions
data_dir = "Dataset"
IMG_HEIGHT = 224
IMG_WIDTH  = 224
channels = 3

# Define the image extensions to search for
image_extensions = ['*.JPG', '*.jpg', '*.JPEG', '*.jpeg']

image_data = []
image_labels = []

class_names = ['non_biodegradable', 'biodegradable']

# Loop through 'train' and 'validation' folders
for folder in ['train', 'validation']:
    folder_path = os.path.join(data_dir, folder)  # Path to train/validation folder
    
    # Loop through each class in the current folder (train/validation)
    for class_name in class_names:
        class_path = os.path.join(folder_path, class_name)
        
        if not os.path.isdir(class_path):
            print(f"Skipping '{class_name}' as it does not exist in {folder} folder.")
            continue
        
        # List all images in the current class folder
        images = os.listdir(class_path)

        for img in images:
            try:
                img_path = os.path.join(class_path, img)
                image = cv2.imread(img_path)

                if image is None:
                    raise ValueError(f"Image {img} could not be read")

                # Convert image to RGB and resize
                image_fromarray = Image.fromarray(image, 'RGB')
                resize_image = image_fromarray.resize((IMG_HEIGHT, IMG_WIDTH))

                # Append the resized image and its label
                image_data.append(np.array(resize_image))
                image_labels.append(f"{folder}/{class_name}")  # Include train/validation in label

            except Exception as e:
                print(f"Error in {img}: {e}")

# Convert lists to numpy arrays
image_data = np.array(image_data)
image_labels = np.array(image_labels)

print(image_data.shape, image_labels.shape)

# Shuffle the data
shuffle_indexes = np.arange(image_data.shape[0])
np.random.shuffle(shuffle_indexes)

image_data = image_data[shuffle_indexes]
image_labels = image_labels[shuffle_indexes]

# Encode labels
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical

labelencoder = LabelEncoder()
image_labels = to_categorical(labelencoder.fit_transform(image_labels))

# Ensure data is in float32 for better memory efficiency
image_data = np.array(image_data, dtype=np.float32)
image_labels = np.array(image_labels, dtype=np.float32)

# Split the data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(image_data, image_labels, test_size=0.3, random_state=42, shuffle=True)

# Normalize the data by dividing by 255 (use float32 to reduce memory footprint)
X_train = X_train / 255.0
X_val = X_val / 255.0

# Print shapes of the data and labels
print("X_train.shape:", X_train.shape)
print("X_val.shape:", X_val.shape)
print("y_train.shape:", y_train.shape)
print("y_val.shape:", y_val.shape)

# Define the model
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization, Input
from keras.models import Sequential

model = Sequential([
    Input(shape=(IMG_HEIGHT, IMG_WIDTH, channels)),  # Input layer specifying the shape

    # Convolutional layers
    Conv2D(filters=256, kernel_size=(3, 3), activation='relu'),
    BatchNormalization(),  # Batch normalization for stability
    Conv2D(filters=128, kernel_size=(3, 3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    # More convolutional layers
    Conv2D(filters=64, kernel_size=(3, 3), activation='relu'),
    BatchNormalization(),
    Conv2D(filters=32, kernel_size=(3, 3), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    # Flattening and Fully Connected layers
    Flatten(),
    Dense(512, activation='relu'),
    BatchNormalization(),  # Batch normalization for fully connected layers

    Dropout(rate=0.5),  # Dropout to prevent overfitting

    # Output layer
    Dense(2, activation='softmax')

])

# Learning rate and decay settings
lr = 0.001
epochs = 30

# Number of classes
num_classes = 2  # Update this to match the number of classes in your dataset

# Define the exponential decay for learning rate
from tensorflow.keras.optimizers.schedules import ExponentialDecay
lr_schedule = ExponentialDecay(
    initial_learning_rate=lr,
    decay_steps=epochs // 2,  # Adjust the decay steps as necessary
    decay_rate=0.5,  # Decay rate
    staircase=True)

# Use the Adam optimizer with the learning rate schedule
from tensorflow.keras.optimizers import Adam
opt = Adam(learning_rate=lr_schedule)

# Compile the model
model.compile(optimizer=opt, loss='categorical_crossentropy', metrics=['accuracy'])

# Data augmentation settings
aug = ImageDataGenerator(
    rotation_range=10,
    zoom_range=0.15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.15,
    horizontal_flip=True,
    vertical_flip=False,
    fill_mode="nearest")

# Define callbacks
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
model_checkpoint = ModelCheckpoint('best_model.h5', monitor='val_loss', save_best_only=True, mode='min')

# Fit the model
history = model.fit(
    aug.flow(X_train, y_train, batch_size=32),
    epochs=epochs,
    validation_data=(X_val, y_val),
    callbacks=[early_stopping, model_checkpoint]
)

# Optionally: You can access the history of the training process for plotting or analysis
print(history.history.keys())
