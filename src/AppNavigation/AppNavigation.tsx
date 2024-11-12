import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ResetPassword from '../Screens/ResetPassword';
import LoginScreen from '../Screens/LoginScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';
import RegistrationnScreen from '../Screens/RegistrationnScreen';


const Stack = createStackNavigator();

const AppNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationnScreen} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} />
        </Stack.Navigator>
    );
};

export default AppNavigation;