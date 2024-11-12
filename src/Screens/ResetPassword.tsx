import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { postMethod } from '../utils/helper';
import Snackbar from 'react-native-snackbar';

const ResetPassword = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')


    const resetPassword = async () => {
        try {
            setLoading(true)
            const body = {
                email: email,
                otp: code,
                password: newPassword,
                password_confirmation: confirmPassword
            }
            const api: any = await postMethod(`api/v2/auth/forget-password/reset-password`, body);
            console.log('api',api.data);
            
            if (api.data.status == true) {
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_LONG,
                    textColor: '#ffffff',
                    backgroundColor: 'green',
                });
                navigation.navigate('LoginScreen')
                setLoading(false)
            } else {
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_LONG,
                    textColor: '#ffffff',
                    backgroundColor: 'red',
                });
                setLoading(false)
            }
        } catch (error) {
            console.log('error in forget-password/reset-password', error);
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
             <View style={{alignItems:'center',justifyContent:'center', marginTop:20}}>
                <Image source={require('../image/css.jpg')} resizeMode='contain' style={{width:'80%', height:100}}/>
            </View>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.forgotText}>Reset password?</Text>
                <Text style={styles.subText}>Enter your email address and new password and confirm password</Text>


                <View style={{ marginTop: 30 }}>
                    <TextInput placeholder='Email' value={email} onChangeText={(text) => setEmail(text)} style={styles.inputBox} />

                    <TextInput placeholder='Code' value={code} onChangeText={(text) => setCode(text)} style={styles.inputBox} />

                    <TextInput placeholder='New Password' value={newPassword} onChangeText={(text) => setNewPassword(text)} style={styles.inputBox} />

                    <TextInput placeholder='Confirm Password' value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} style={styles.inputBox} />
                </View>

                <Pressable style={styles.btnBox} onPress={resetPassword}>
                    <Text style={styles.resetText}>Reset Password</Text>
                </Pressable>

            </View>

        </View>
    )
}

export default ResetPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 30
    },
    forgotText: {
        fontSize: 24,
        fontWeight: '600',
        color: 'black',
        marginBottom: 10
    },
    subText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'gray'
    },
    inputBox: {
        width: '100%',
        height: 50,
        borderWidth: 0.4,
        borderColor: 'gray',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 6,
        fontSize: 15,
        fontWeight: '600',
        color: 'black'
    },
    btnBox: {
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 0.4,
        borderRadius: 6,
        height: 40,
        backgroundColor: 'red',
        borderColor: 'red'
    },
    resetText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500'
    }
})