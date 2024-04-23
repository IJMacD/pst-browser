import React, { useEffect, useMemo, useState } from "react";
import { formatSize } from "../util/formatSize";

/**
 *
 * @param {object} props
 * @param {import("pst-parser").Message} props.message
 * @returns
 */
export function AttachmentView ({ message }) {
    const [ selectedIndex, setSelectedIndex ] = useState(-1);
    const [ selectedBlobURL, setSelectedBlobURL ] = useState(/** @type {string?} */(null));

    useEffect(() => {
        setSelectedIndex(-1);
    }, [message]);

    const attachments = message.getAttachmentEntries();

    const selectedAttachment = useMemo(() => {
        return selectedIndex >= 0 ? message.getAttachment(selectedIndex) : null;
    }, [message, selectedIndex]);

    useEffect(() => {
        if (selectedAttachment) {
            const isSelectedAPDF = selectedAttachment && /\.pdf$/.test(selectedAttachment.attachFilename);

            const type = isSelectedAPDF ? "application/pdf" : selectedAttachment.attachMimeTag;

            const blobURL = URL.createObjectURL(new Blob([selectedAttachment.attachDataBinary], { type }));

            setSelectedBlobURL(blobURL);

            return () => URL.revokeObjectURL(blobURL);
        }
        else {
            setSelectedBlobURL(null);
        }
    }, [selectedAttachment]);

    const isSelectedAnImage = selectedAttachment && /^image\//.test(selectedAttachment.attachMimeTag);

    const isSelectedAPDF = selectedAttachment && /\.pdf$/.test(selectedAttachment.attachFilename);

    /**
     *
     * @param {number} index
     */
    function handleSave (index) {
        const attachment = message.getAttachment(index);

        if (attachment) {
            console.log(attachment);
            const isSelectedAPDF = /\.pdf$/.test(attachment.attachFilename);
            const type = isSelectedAPDF ? "application/pdf" : attachment.attachMimeTag;
            const blobURL = URL.createObjectURL(new Blob([attachment.attachDataBinary], { type }));
            const a = document.createElement("a");
            a.download = attachment.attachLongFilename || attachment.attachFilename;
            a.href = blobURL;
            document.body.append(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobURL);
        }
    }

    return (
        <div>
            <table style={{borderCollapse: "collapse", width: "100%", marginTop:"2em", marginBottom:"2em"}}>
                <thead>
                    <tr><th>Filename</th><th>Size</th><th>Actions</th></tr>
                </thead>
                <tbody>
                {
                    attachments.map((attachment, i) => (
                        <tr
                            key={i}
                            style={{
                                fontWeight: i===selectedIndex?"bold":"",
                                cursor:"pointer"
                            }}
                            onClick={() => setSelectedIndex(i)}
                        >
                            <td>{attachment.attachFilename}</td>
                            <td>{formatSize(attachment.attachSize)}</td>
                            <td><button onClick={e => { e.stopPropagation(); handleSave(i); }}>Save</button></td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            {
                isSelectedAnImage && selectedBlobURL &&
                <img src={selectedBlobURL} alt="Attachment" style={{width:"100%"}} />
            }
            {
                isSelectedAPDF && selectedBlobURL &&
                <iframe src={selectedBlobURL} title="Attachment" style={{width:"100%", minHeight:800}} />
            }
        </div>
    );
}