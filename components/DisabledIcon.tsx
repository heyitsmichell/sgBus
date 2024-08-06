import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Disabled = (props) => (
  <Svg width={props.width || 24} height={props.height || 24} viewBox="0 0 1024 1024" fill="none" {...props}>
    <Path
      d="M445.289736 304.663167a70.39648 70.39648 0 1 0-73.596321-66.966252 70.39648 70.39648 0 0 0 73.596321 66.966252z m359.662016 390.99485l-107.156242-157.432128a35.838208 35.838208 0 0 0-5.785311-6.476476 44.452177 44.452177 0 0 0-31.473626-13.196141H516.953352l-2.086295-43.441028H643.935803a27.774611 27.774611 0 1 0 0-55.549222H512.255987l-2.009499-41.969102a62.524874 62.524874 0 1 0-124.908955 5.938903l7.871607 164.177391a62.716864 62.716864 0 0 0 65.340733 59.478627c0.383981 0 0.691165-0.153592 0.99835-0.153593 1.279936 0.076796 2.559872 0.383981 3.839808 0.383981h191.632018l88.571571 130.067097a37.118144 37.118144 0 1 0 61.334534-41.81551z m-156.152192-47.754412a2.163092 2.163092 0 0 0-3.929404 0.921554 172.304985 172.304985 0 1 1-288.459177-149.662917 4.902155 4.902155 0 0 0 1.548723-3.699015l-2.931053-61.948903a3.507025 3.507025 0 0 0-5.324534-2.777461 230.554872 230.554872 0 1 0 338.299885 280.305985 6.988451 6.988451 0 0 0-0.691166-6.39968l-38.500475-56.701165z"
      fill={props.fill || "#fff"} // Use props.fill to dynamically set color
    />
  </Svg>
);

export default Disabled;
