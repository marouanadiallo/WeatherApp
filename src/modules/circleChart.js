import React from 'react';
import {View, TextInput, Animated, StyleSheet, useWindowDimensions} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {useTheme} from '@ui-kitten/components';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);


const CircleChart = ({
    percentage = 100,
    radius = 50,
    strokeWidth = 10,
    duration = 500,
    delay = 0,
    max = 100,
    color='color-primary-500',
    fill='transparent'
})=>{
    const win = useWindowDimensions();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    
    const circleRef = React.useRef();
    const textRef = React.useRef();

    const halfCircle = radius + strokeWidth;
    const circonference = 2 * Math.PI * radius;
    const theme = useTheme();

    const animation = (toValue) =>{
        return Animated.timing(animatedValue,{
            toValue,
            duration,
            delay,
            useNativeDriver: true
        }).start()
    }

    const strokeDashoffset = circonference - (circonference * percentage) / max;
    React.useEffect(()=>{
        animation(percentage);

        animatedValue.addListener(v => {
            if(circleRef?.current){
                const maxPerc = 100 * v.value / max;
                const strokeDashoffset = circonference - (circonference * maxPerc) / 100;

                circleRef.current.setNativeProps({
                    strokeDashoffset
                });
            }

            if(textRef?.current){

                textRef.current.setNativeProps({
                    text: `${Math.round(v.value)}%`,
                });

            }
        });
        return () => {
            animatedValue.removeAllListeners();
        }
    }, [max, percentage])
    return(
        <View>
            <Svg 
                width={radius * 2} 
                height={radius * 2} 
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2 }`}
            >
                <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx='50%'
                        cy='50%'
                        stroke={theme[color]}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill={fill}
                       strokeOpacity={0.2}
                    />
                    <AnimatedCircle
                        ref={circleRef}
                        cx='50%'
                        cy='50%'
                        stroke={theme[color]}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill="transparent"
                        strokeDasharray={circonference}
                        strokeDashoffset={circonference}
                        strokeLinecap='round'
                    />
                </G>
            </Svg>
            <AnimatedText
                ref={textRef}
                underlineColorAndroid="transparent"
                editable={false}
                defaultValue='0'
                style={[
                    StyleSheet.absoluteFillObject,
                    {fontSize: radius/3, fontWeight:'bold'},
                    { textAlign:"center", textAlignVertical:'center', color:theme['color-primary-500']}
                ]}
            />
        </View>

    );
}

export default CircleChart;