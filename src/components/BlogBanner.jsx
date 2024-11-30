import { Box } from '@mui/material';
import { axiosPrivate } from '../api/axios';
import useBlog from '../hooks/useBlog';

const BlogBanner = () => {
    const {blogState, setBlogState} =  useBlog();
    const {banner, prevBanner} = blogState;

    const deletePrevBannerHandler = async () => {
        if (prevBanner) {
            try {
                await axiosPrivate.delete(`/file/${prevBanner}`);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const handleImageError = (e) => {
        e.target.src = "/src/assets/blog_banner.png"; 
    };
    const handleFileSelect = (event) => {
        const img = event.target.files[0];
        
        if (img) {
            // deletePrevBannerHandler();
            setBlogState((prev) => ({
                ...prev,
                prevBanner: null, //set the previously upload banner to null  
                banner: URL.createObjectURL(img), //update new banner 
            }));
        }
    };
    return (
        <Box sx={{ width: "100%" }}>
            <label htmlFor='uploadBanner'>
                <img
                    src={banner || "/src/assets/blog_banner.png"}
                    style={{ zIndex: 20, width: "100%", height: 'auto' }}
                    alt="Banner"
                    onError={handleImageError}
                />
                <input
                    id="uploadBanner"
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                    accept='.png, .jpg, .jpeg'
                />
            </label>
        </Box>
    );
}

export default BlogBanner;
