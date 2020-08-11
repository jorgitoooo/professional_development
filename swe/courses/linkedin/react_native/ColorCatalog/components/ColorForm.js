import React, { useState, useRef } from 'react';
import {
    Button,
    StyleSheet,
    View,
    TextInput
} from 'react-native';

export default function ColorForm({ onNewColor  = f => f}) {
    const [inputValue, setInputValue] = useState('');
    const input = useRef();

    return (
        <View style={styles.container}>
            <TextInput
                ref={input}
                value={inputValue}
                onChangeText={text => setInputValue(text)}
                style={styles.textInput}
                autoCapitalize='none'
                placeholder='Enter a color...'
            />
            <Button
                title='Add'
                onPress={() => {
                    input.current.blur();
                    onNewColor(inputValue);
                    setInputValue('');
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        borderWidth: 2,
        fontSize: 20,
        margin: 5,
        padding: 5,
        borderRadius: 5
    }
})