import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg";

const Cart = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
        <Path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
        <Path d="M6 6H22" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
        <Circle cx="6" cy="20" r="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
        <Circle cx="17" cy="20" r="2" stroke="currentColor" strokeWidth={props.strokeWidth} />
        <Path d="M8 20L15 20" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
        <Path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
    </Svg>
);

export default Cart;