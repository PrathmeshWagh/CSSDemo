import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, Button, Image } from 'react-native';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Snackbar from 'react-native-snackbar';
import CheckBox from '@react-native-community/checkbox';
import { postMethod, storeData } from '../utils/helper';
const RegistrationnScreen = ({ navigation }:any) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, formState: { errors, isValid }, getValues } = useForm({
        defaultValues: {
            email: '',
            fullName: '',
            userName: '',
            mobileNumber: '',
            password: '',
            confirmPassword: ''
        }
    });



    const onSubmit = async (data) => {
        LoginHandler(data)
    }

    const LoginHandler = async (props) => {
        try {
            setLoading(true)
            const raw = {
                name: props.fullName,
                user_name: props.userName,
                phone: props.mobileNumber,
                email: props.email,
                password: props.password,
                password_confirmation: props.confirmPassword,
                
            }
            console.log('raw', raw);

            const api:any = await postMethod(`api/v2/auth/signup`, raw);
            // console.log('apppp', api);

            if (api.data.status===true) {
                await storeData(api.data)
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_LONG,
                    textColor: '#ffffff',
                    backgroundColor: 'green',
                });
                navigation.replace('LoginScreen')
                setLoading(false)
            } else {
                Snackbar.show({
                    text: api.data.message,
                    duration: Snackbar.LENGTH_LONG,
                    textColor: '#AE1717',
                    backgroundColor: '#F2A6A6',
                });
                setLoading(false)
            }
        } catch (error) {
            console.log('error in register handler', error);
            Snackbar.show({
                text: 'Something Went Wrong Please Try Again',
                duration: Snackbar.LENGTH_LONG,
                textColor: '#AE1717',
                backgroundColor: '#F2A6A6',
            });
            setLoading(false)
        }
    }

    return (
        <ScrollView style={styles.container}>

            <View style={{alignItems:'center',justifyContent:'center', marginTop:20}}>
                <Image source={require('../image/css.jpg')} resizeMode='contain' style={{width:'80%', height:100}}/>
            </View>
            <Text style={styles.signUpText}>Create an account</Text>
            <View style={{ marginBottom: 20 }}>

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name='fullName'
                    render={({ field: { onChange, value } }) => (
                        <>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Full Name'
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.fullName && <Text style={styles.errorText}>The Name field is required</Text>}
                        </>
                    )}
                />


                <Controller
                    control={control}
                    rules={{
                        required: true,
                        pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                    }}
                    name='email'
                    render={({ field: { onChange, value } }) => (
                        <>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Email'
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.email && errors.email.type === "required" && (
                                <Text style={styles.errorText}>Email is Required</Text>
                            )}
                            {errors.email && errors.email.type === "pattern" && (
                                <Text style={styles.errorText}>Email is Not Valid</Text>
                            )}
                        </>
                    )}
                />

                <Controller
                    control={control}
                    rules={{ required: true }}
                    name='userName'
                    render={({ field: { onChange, value } }) => (
                        <>
                            <Text style={styles.inputLabel}>User Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='User Name'
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.userName && <Text style={styles.errorText}>The user name field is required</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    rules={{ required: true, minLength: 8, maxLength: 8, pattern: /^[0-9]+$/ }}
                    name='mobileNumber'
                    render={({ field: { onChange, value } }) => (
                        <>
                            <Text style={styles.inputLabel}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Phone'
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.mobileNumber && <Text style={styles.errorText}>The Phone field is Required</Text>}
                            {errors.mobileNumber && errors.mobileNumber.type === 'minLength' && <Text style={styles.errorText}>8 Digit Required</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name='password'
                    render={({ field: { onChange, value } }) => (
                        <>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Password'
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                            />
                            <Text style={{fontSize:12, fontWeight:'400', color:'gray', textAlign:'right', marginBottom:5}}>Password must contain at least 6 digits</Text>
                            {errors.password && <Text style={styles.errorText}>The Password field is Required</Text>}
                        </>
                    )}
                />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                        validate: (value) => value === getValues('password') || 'Passwords do not match',
                    }}
                    name='confirmPassword'
                    render={({ field: { onChange, value } }) => (
                        <>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Confirm Password'
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.confirmPassword && <Text style={styles.errorText}>Confirm Password is Required</Text>}
                            {errors.confirmPassword && errors.confirmPassword.type === 'validate' && <Text style={styles.errorText}>Passwords does not match</Text>}
                        </>
                    )}
                />
                <View style={styles.checkBoxAndTextContainer}>
                    <CheckBox
                    
                        disabled={false}
                        value={toggleCheckBox}
                        onValueChange={(newValue) => setToggleCheckBox(newValue)}
                    />
                    <Text style={styles.checkBoxText}>By signing up you agree to our terms and conditions</Text>
                </View>

                <Pressable style={{ marginTop: 20, backgroundColor: 'red', width: '80%', alignSelf: 'center', height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.registerBtnText}>Create Account</Text>
                </Pressable>
                <Text style={styles.alreadyText}>Already have an account? <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('LoginScreen')}>Sign in</Text></Text>
            </View>
        </ScrollView>
    )
}

export default RegistrationnScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    signUpText: {
        fontSize: 22,
        fontWeight: '700',
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
        marginBottom: 5,
        marginTop:10
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        // marginBottom: 10
    },
    checkBoxAndTextContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'black'
    },
    subscriptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        marginLeft: 5,
        marginTop: 20
    },
    checkConditionText: {
        fontSize: 11,
        fontWeight: '600',
        color: 'black',
        marginLeft: 5,
        marginBottom: 20
    },
    emailAndPhoneCheckBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxDirection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    emailAndPhoneText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black'
    },
    registerBtn: {
        width: 160,
        height: 40,
        borderRadius: 50,
        marginTop: 20,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    registerBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white'
    },
    alreadyText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
        marginTop: 20
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        // marginLeft: 5
    }
})