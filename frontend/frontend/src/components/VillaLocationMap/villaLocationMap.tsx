"use client";

import React from "react";

const VillaLocationMap = () => {


  return (
    <div className="villa-location-container">

      {/* Map Container */}
      <div className="h-[400px] w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.758550577077!2d105.9156325!3d19.7654104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313651005dfbcd31%3A0x741fcc577d61514!2zVmlsbGEgTmfhu41jIFhhbmggU-G6p20gU8ahbg!5e0!3m2!1svi!2s!4v1743354715566!5m2!1svi!2s"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>


    </div>
  );
};

export default VillaLocationMap;
