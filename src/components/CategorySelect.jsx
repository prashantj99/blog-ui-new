import { Box, FormControl, InputLabel, Select, MenuItem, ListItemText } from '@mui/material';
import useBlog from '../hooks/useBlog';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { ALL_CATEGORY_URL } from '../commons/AppConstant';

const CategorySelect = () => {
    const { blogState, setBlogState } = useBlog();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(ALL_CATEGORY_URL);
                setCategories(response.data);
                console.log(response.data);
                
            } catch (err) {
                console.log('require relaod!! '+err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        console.log(categories);
    }, [categories])

    const handleChange = (event) => {
        setBlogState({ ...blogState, categoryId: event.target.value })
    };

    return (
        <Box sx={{ minWidth: 120, mb: 2 }}>
            <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={blogState?.categoryId || ''}
                    label="Category"
                    onChange={handleChange}
                >
                    {categories?.map(({ categoryId, description, title }) => (
                        <MenuItem key={categoryId} value={categoryId}>
                            <ListItemText primary={title} secondary={description} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CategorySelect;
