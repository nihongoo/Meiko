import apiURL from "../../Routes/API/index.js";
import { toast } from "react-toastify";


function SubmitButton({ obj, image }) { 
    const handleCreateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('file', image.img);
            formData.append('upload_preset', 'datnMeiko');
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dtsqxauba/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const res = await fetch(apiURL.product.create, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            if (!res.ok) {
                const msg = await res.json()
                const firstError = Object.entries(msg.errors)[0];
                if (firstError) {
                    const [field, messages] = firstError;
                    toast.error(messages[0]);
                    console.log(field);
                }
            }
            else {
                toast.success(`Thêm mới sản phẩm thành công`)
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            className="position-fixed"
            style={{ bottom: '20px', right: '35px', zIndex: 10 }}
        >
            <button
                className="btn btn-success"
                onClick={handleCreateProduct}
            >
                Create
            </button>
        </div>
    );
}

export default SubmitButton;