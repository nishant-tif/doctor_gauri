"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  fetchCategories,
  createCategory,
  deleteCategory,
  clearCategoryError,
} from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store";

interface CategoryManagementModalProps {
  open: boolean;
  onClose: () => void;
}

export const CategoryManagementModal: React.FC<
  CategoryManagementModalProps
> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();

  const { categories, loading, error } = useAppSelector(
    (state) => state.categories,
  );

  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = async () => {
    // e.preventDefault();

    if (!categoryName.trim()) return;

    const slug = categoryName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    await dispatch(
      createCategory({
        category_name: categoryName,
        category_slug: slug,
      }),
    );

    setCategoryName("");
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await dispatch(deleteCategory(categoryId.toString()));
  };
  useEffect(() => {
    if (open) {
      console.log("createCategoryaknfgdsaf");
      dispatch(fetchCategories({ page: 1, size: 100 }));
    }
  }, [open, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Manage Categories</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => dispatch(clearCategoryError())}
          >
            {error}
          </Alert>
        )}

        {/* Add Category Form */}
        <form
          onSubmit={handleAddCategory}
          style={{ marginBottom: 20, marginTop: 10 }}
        >
          <div
            style={{ display: "flex", gap: 8, marginBottom: 16, paddingTop: 2 }}
          >
            <TextField
              fullWidth
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              variant="outlined"
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Add"}
            </Button>
          </div>
        </form>

        {/* Category Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Category Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading &&
                categories &&
                categories.map((category) => (
                  <TableRow key={category?.category_id}>
                    <TableCell>{category?.category_name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDeleteCategory(category?.category_id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryManagementModal;
