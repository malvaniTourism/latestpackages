import React from "react";
import { Image, TouchableOpacity } from "react-native";
import styles from "./Styles";
import GlobalText from "../Customs/Text";
import Path from "../../Services/Api/BaseUrl";

const SubCatCard = ({ data, onClick }) => {
    return (
        <TouchableOpacity style={styles.subCatCard} onPress={() => onClick()}>
            {/* <Image
                source={{ uri: Path.FTP_PATH + data.icon }}
                style={styles.catCardIcon}
            /> */}
            <GlobalText text={data.name} />
        </TouchableOpacity>
    );
};

export default SubCatCard;
