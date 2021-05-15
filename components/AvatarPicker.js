import React from "react";
import AvatarEditor from "react-avatar-editor";
import { Grid, Slider, Button } from "@material-ui/core";
import { generatePutUrl, uploadToS3 } from "../lib/api";

class AvatarPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { scaleValue: 1 };
        this.onScaleChange = this.onScaleChange.bind(this);
        this.onCrop = this.onCrop.bind(this);
    }

    dataUrlToFile = (dataurl, filename) => {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    onCrop = async (event, callback) => {
        event.preventDefault();
        if (this.editor !== null) {
            const url = this.editor.getImageScaledToCanvas().toDataURL(); //data image base 64
            let file = this.dataUrlToFile(url, "profile.jpg");
            const response = await generatePutUrl(file);
            if (response.status == "ok") {
                const { url, key } = response.file;
                file.url = url;
                file.key = key;
                await uploadToS3(file, null);
                callback(file);
            } else {
                alert(response.message);
            }
        }
    };

    onScaleChange = (e, val) => {
        this.setState({ scaleValue: val });
    };

    render() {
        const { onCrop, onScaleChange } = this;
        const { scaleValue } = this.state;
        const { image, callback, width, height, borderRadius } = this.props;
  
        return (
            <Grid container className="avatar-editor">
                <Grid
                    container
                    justify="center"
                    className="avatar-editor-preview"
                >
                    <AvatarEditor
                        ref={(editor) => (this.editor = editor)}
                        image={image}
                        width={width || 250}
                        height={height || 250}
                        border={0}
                        borderRadius={borderRadius || 150}
                        color={[128, 128, 128, 0.6]} // RGBA
                        scale={scaleValue}
                        rotate={0}
                    />
                </Grid>
                <Grid container className="avatar-editor-input">
                    <Slider
                        className="avatar-editor-slider"
                        value={scaleValue}
                        name="points"
                        min={1}
                        max={10}
                        step={0.5}
                        onChange={onScaleChange}
                    />
                    <Button
                        className="avatar-editor-save my-btn"
                        color="primary"
                        onClick={(event) => onCrop(event, callback)}
                    >
                        SAVE
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default AvatarPicker;
