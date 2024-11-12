import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { postMethod } from '../utils/helper';
import Snackbar from 'react-native-snackbar';


const ForgotPasswordScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false)
    const [uemail, setUEmail] = useState('');

    const forgotPass = async () => {
        try {
            setLoading(true);
            const body = {
                email: uemail
            }
            const api: any = await postMethod(`api/v2/auth/forget-password/send-otp`, body);

            if (api.data.status == true) {
                console.log('api', api.data);

                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_LONG,
                    textColor: '#ffffff',
                    backgroundColor: 'green',
                });
                navigation.replace('ResetPassword')
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
            setLoading(false)
            console.log('error in forget-password/send-otp', error);

        }
    }
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                <Image source={require('../image/css.jpg')}resizeMode='contain' style={{ width: '80%', height: 100 }} />
            </View>
            <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.forgotText}>Forgot password?</Text>
                <Text style={styles.subText}>Enter your email address to recover your password.</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        placeholder='Email'
                        onChangeText={(text) => setUEmail(text)}
                        value={uemail}
                        style={{ fontSize: 14, fontWeight: '500', color: 'black' }}
                    />
                </View>

                <Pressable style={styles.resetBtn} onPress={forgotPass}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '500', color: 'white'
                    }}>Send Password Reset Link</Text>
                </Pressable>

                <Pressable style={{ marginTop: 10 }} onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.subText}>Back to Login</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 30
    },
    forgotText: {
        fontSize: 24,
        fontWeight: '600',
        color: 'black'
    },
    subText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'black'
    },
    inputBox: {
        marginTop: 30,
        width: '100%',
        height: 40,
        borderWidth: 0.6,
        borderColor: 'black'
    },
    resetBtn: {
        width: '80%',
        height: 40,
        backgroundColor: 'red',
        borderRadius: 6,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }
})