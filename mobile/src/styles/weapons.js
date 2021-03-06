import { StyleSheet, Platform } from 'react-native'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B2936',
        paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
    },
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    weaponContainer: {
        margin: vmin(2),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#0ae',
        width: vmin(40),
        height: vmin(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    dataView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: vmin(100)
    },
    Text: {
        color: 'white'
    }
});