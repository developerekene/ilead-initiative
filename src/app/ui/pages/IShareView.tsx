import React from 'react'
import Hero from '../components/Hero'

const IShareView = () => {
    return (
        <div>
            <Hero
                badge="iShare Community Exchange"
                firstTitle="Share your journey."
                secondTitle="Lift as you"
                thirdTitle="climb"
                desc="True impact shouldn't be kept to yourself. iShare is our community-driven storytelling and support network where individuals map out real life challenges, personal victories, and practical paths to help others grow, ensuring nobody has to figure life out alone."
                buttonOneText="Explore Stories"
                buttonTwoText="Share Your Journey"
                btnOneNavigation='/'
                btnTwoNavigation='/'
            />
        </div>
    )
}

export default IShareView