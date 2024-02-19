interface labelValue {
    label: string;
    value: string;
    fontSize: string;
}

const LabelWithValue: React.FC<labelValue> = ({ label, value, fontSize}) => {
    return (
        <div style={{ flexDirection: "row", display: "flex" }}>
            <p style={{ fontSize: fontSize, color: "#777", margin: "0" }}>{label}</p>
            <p style={{ fontSize: fontSize, color: "#fff", margin: "0" }}>{value}</p>
        </div>
    );
}

export default LabelWithValue;