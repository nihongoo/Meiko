import apiURL from "../../Routes/API";
import { toast } from "react-toastify";


function SubmitButton({ obj, image }) {    
    const handleCreateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append('file', image.img);
            formData.append('upload_preset', 'Khanh_Hoang');
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dtlxhfejw/image/upload`,
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
            const msg = await res.json()
            console.log(res.ok);
            
            if (res.ok) {
                toast.success(`Thêm mới sản phẩm thành công`)
            }
            else {
                Object.entries(msg.errors).forEach(([field,message])=>{
                    console.log(`${message[0]}`);
                })
                toast.error('Thêm thất bại')              
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