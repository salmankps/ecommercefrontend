import React from 'react'
import NavBar from './navbar'

function AboutPage() {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      <NavBar/>
      <div className='about'>
        <h1>About</h1>
        <p>About PlayBox

Welcome to PlayBox, the ultimate destination for action figure enthusiasts! Explore an incredible collection of action figures from Marvel, DC, anime, Star Wars, and many more iconic universes.

With PlayBox, collecting has never been easier:

Extensive Collection: Discover heroes, villains, and legendary characters from your favorite franchises.

Wishlist & Cart: Save your favorite figures or purchase them instantly.

Detailed Product Info: View high-quality images, descriptions, and prices to make informed choices.

Secure Checkout: Shop with confidence with safe and reliable payment options.

Personalized Experience: Keep track of your collection and get recommendations tailored to your interests.

Whether you’re a casual fan or a dedicated collector, PlayBox is your one-stop app for discovering, collecting, and celebrating your favorite action figures. Start building your ultimate collection today!</p>
      </div>
    </div>
  )
}

export default AboutPage