import Banner from "./_components/Banner"
import Problem from "./_components/Problem"
import Solution from "./_components/Solution"
import WhyUs from "./_components/WhyUs"
export default function Home(){
    return(
        <>
        
        {/* <img src="/photos/banner2.jpg" className="w-full max-h-screen object-cover "/> */}
        <Banner />
        <Problem />
        <Solution />
        <WhyUs />
       </>
    )
}