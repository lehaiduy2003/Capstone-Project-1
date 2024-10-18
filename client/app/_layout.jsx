// import React, { useState, useEffect } from 'react';
// import { Slot } from 'expo-router';
// import SplashScreen from './splash'; 


// const _layout = () => {

//     return <Stack screenOptions={{
//         headerShown: false
//     }}>
//         <Stack.Screen name="homeScreen" options={{ headerTitle: false }} />
//         {/* <Stack.Screen name="(tabs)" options={{ headerTitle: false }} /> */}
//         {/* <Stack.Screen name="HomePage/homePage" options={{ headerTitle: false }} /> */}


//     </Stack>


// };

// export default _layout;


import React, { useState, useEffect } from 'react';
import { Slot } from 'expo-router';
import Splash from './splash';  // Path to your SplashScreen component

const _layout = () => {
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        // Simulate splash screen for 3 seconds
        const timer = setTimeout(() => {
            setIsSplashVisible(false);
        }, 3000);

        // Clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    // If splash screen is still visible, render the SplashScreen component
    if (isSplashVisible) {
        return <Splash />;
    }

    // After the splash screen, render child components using <Slot />
    return <Slot />;
};

export default _layout;


