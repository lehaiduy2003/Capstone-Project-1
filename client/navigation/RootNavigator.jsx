// navigation/RootNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../app/welcome';
import SignUp from '../app/signUp';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="welcome" component={Welcome} />
                <Stack.Screen name="signUp" component={SignUp} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;