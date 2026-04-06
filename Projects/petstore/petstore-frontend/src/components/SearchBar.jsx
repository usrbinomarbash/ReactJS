import React, { useState } from 'react';
import { TextField, InputAdornment, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch, searchFields, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState(searchFields[0].value);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(searchField, value);
    };

    const handleFieldChange = (e) => {
        setSearchField(e.target.value);
        if (searchTerm) {
            onSearch(e.target.value, searchTerm);
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Search By</InputLabel>
                <Select
                    value={searchField}
                    label="Search By"
                    onChange={handleFieldChange}
                >
                    {searchFields.map((field) => (
                        <MenuItem key={field.value} value={field.value}>
                            {field.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            
            <TextField
                fullWidth
                placeholder={placeholder || "Search..."}
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;