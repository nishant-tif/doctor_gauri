"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchCountries } from "@/store/slices/countriesSlice";
import { fetchStates } from "@/store/slices/stateSlice";
import { fetchCities } from "@/store/slices/citySlice";
import { createArticle } from "@/store/slices/articleSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import { SelectChangeEvent } from "@mui/material/Select";

import CategoryManagementModal from "@/components/article/CategoryManagementModal";
import dynamic from "next/dynamic";
import type { Editor as TinyMCEEditor } from "tinymce";
import { fetchAuthors } from "@/store/slices/authorSlice";
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false },
);
interface ArticleFormProps {
  article?: Article | null;
  onCancel: () => void;
  loading?: boolean;
}

interface Country {
  id: string | number;
  countryName: string;
}
interface State {
  id: string;
  state_id: string;
  stateName: string;
}
interface City {
  id: string;
  city_id: string;
  cityName: string;
}
const AddArticle: React.FC<ArticleFormProps> = ({
  article,
  onCancel,
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { authors } = useAppSelector((state) => state.author);
  const { categories } = useAppSelector((state) => state.categories);
  const { countries } = useAppSelector((state) => state.countries);
  const { states } = useAppSelector((state) => state.states);
  const { cities } = useAppSelector((state) => state.cities);

  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    article_id: article?.article_id ?? "",
    article_title: article?.article_title ?? "",
    article_slug: article?.article_slug ?? "",
    article_excerpt: article?.article_excerpt ?? "",
    article_content: article?.article_content ?? "",
    article_visibility: article?.article_visibility ?? "DRAFT",
    author_id: article?.author_id?.toString() ?? "",
    article_thumbnail_image: article?.article_thumbnail_image ?? "",
    meta_title: article?.meta_title ?? "",
    meta_description: article?.meta_description ?? "",
    meta_keywords: article?.meta_keywords ?? "",
    country_id: article?.country_id ?? "",
    state_id: article?.state_id ?? "",
    city_id: article?.city_id ?? "",
    category_id: article?.category_id ?? "",
  });
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const handleOpenCategoryModal = () => {
    setOpenCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
  };
  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    dispatch(fetchCategories({ page: 1, size: 100 }));
    dispatch(fetchCountries());
    dispatch(fetchAuthors({ page: 1, size: 100 }));
  }, [dispatch]);

  /* ================= FETCH STATES ================= */
  useEffect(() => {
    if (formData.country_id) {
      dispatch(fetchStates(formData.country_id));
    }
  }, [formData.country_id, dispatch]);

  /* ================= FETCH CITIES ================= */
  useEffect(() => {
    if (formData.state_id) {
      dispatch(fetchCities(formData.state_id));
    }
  }, [formData.state_id, dispatch]);

  /* ================= INPUT CHANGE ================= */
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "author_id") {
        return {
          ...prev,
          author_id: value,
        };
      }
      if (name === "category_id") {
        return {
          ...prev,
          category_id: value,
        };
      }
      if (name === "country_id") {
        return {
          ...prev,
          country_id: value,
          state_id: "",
          city_id: "",
        };
      }

      if (name === "state_id") {
        return {
          ...prev,
          state_id: value,
          city_id: "",
        };
      }

      return {
        ...prev,
        [name as keyof typeof prev]: value,
      };
    });
  };

  /* ================= SLUG ================= */
  const generateSlug = () => {
    const slug = formData.article_title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      article_slug: slug,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.article_title ||
      !formData.article_slug ||
      !formData.article_content
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(createArticle(formData)).unwrap();
      toast.success("Article created successfully!");
      navigate.push("/articles");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    }
  };

  /* ================= FILE UPLOAD ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;

      let width = img.width;
      let height = img.height;

      // resize if large
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = width * (MAX_HEIGHT / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;
      let base64 = canvas.toDataURL("image/jpeg", quality);

      // reduce until below 200kb
      while (base64.length / 1024 > 200 && quality > 0.1) {
        quality -= 0.1;
        base64 = canvas.toDataURL("image/jpeg", quality);
      }

      setFormData((prev) => ({
        ...prev,
        article_thumbnail_image: base64,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleEditorInit = (evt: unknown, editor: TinyMCEEditor) => {
    editorRef.current = editor;
  };
  const autosavePrefix = "tinymce-autosave-{path}{query}-{id}-";

  const h = 600;
  return (
    <Layout title="">
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          {article ? "Edit Article" : "Create New Article"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <Card sx={{ mb: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid
                spacing={2}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Grid>
                  <TextField
                    fullWidth
                    label="Title"
                    name="article_title"
                    value={formData.article_title}
                    onChange={handleInputChange}
                    placeholder="Enter article title"
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Slug"
                    name="article_slug"
                    value={formData.article_slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-from-title"
                    required
                    helperText="URL-friendly version of the title (auto-generated, but you can edit it)"
                    variant="outlined"
                  />
                </Grid>
                <Grid>
                  <Button
                    variant="outlined"
                    onClick={generateSlug}
                    sx={{ mt: 1, height: 56 }}
                    fullWidth
                  >
                    Generate Slug
                  </Button>
                </Grid>

                {/* ================= THUMBNAIL (UPDATED DESIGN) ================= */}
                <Grid>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Thumbnail Image *
                  </Typography>

                  <Typography sx={{ color: "#f78fb3", mb: 2 }}>
                    Widget Image
                  </Typography>

                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      border: "2px dashed #f8a5c2",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      mb: 2,
                      overflow: "hidden",
                    }}
                  >
                    {formData.article_thumbnail_image ? (
                      <Box
                        component="img"
                        src={formData.article_thumbnail_image}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: 40, color: "#ccc" }}>
                        📷
                      </Typography>
                    )}
                  </Box>

                  <Typography sx={{ fontSize: 13, color: "#777", mb: 1 }}>
                    Widget image: max image size 100–200 kb.
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      border: "1px solid #f8a5c2",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Button
                      component="label"
                      sx={{
                        flex: 1,
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "#777",
                      }}
                    >
                      Choose File
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>

                    <Box
                      sx={{
                        backgroundColor: "#f78fb3",
                        color: "#fff",
                        px: 3,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      BROWSE
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {/* </Grid> */}
            </CardContent>
          </Card>
          {/* tiny content section */}
          <Grid sx={{ backgroundColor: "#fff" }}>
            <Editor
              tinymceScriptSrc="/tinymce/tinymce.min.js"
              onInit={handleEditorInit}
              value={formData.article_content || ""}
              onEditorChange={(content) => {
                setFormData((prev) => ({
                  ...prev,
                  article_content: content,
                }));
              }}
              init={{
                menubar: "favs file edit view insert format tools table",
                paste_word_valid_elements:
                  "b,i,p,a[href],ol,ul,li,em,br,style,strong,bold",
                image_title: true,
                automatic_uploads: true,
                branding: false,
                autosave_interval: "5s",
                autosave_retention: "1000m",
                autosave_restore_when_empty: true,
                autosave_prefix: autosavePrefix,

                toolbar:
                  "inserttweet | insertpolls | insertbacklink | image | styleselect fontselect fontsizeselect | media | forecolor backcolor | dialog-timeline-btn | undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons",

                menu: {
                  favs: {
                    title: "Menu",
                    items: "visualaid | searchreplace | emoticons",
                  },
                },

                plugins: [
                  // "textcolor",
                  "advlist",
                  "autolink",
                  "link",
                  "image",
                  "lists",
                  "charmap",
                  "preview",
                  "anchor",
                  "pagebreak",
                  "searchreplace",
                  "wordcount",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "emoticons",
                  "codesample",
                  "autosave",
                  "media",
                ],

                media_live_embeds: true,

                invalid_elements: "script,strong",

                extended_valid_elements:
                  "b|style|div[class]|span|a[href|target=_blank]|br|iframe[src|title|width|height|allowfullscreen|frameborder]",

                height: h === undefined ? 600 : h,

                custom_elements: "style",

                image_caption: true,

                a11y_advanced_options: true,

                inline_styles: true,

                cleanup: true,

                formats: {
                  bold: { inline: "b" },
                  italic: { inline: "i" },
                  underline: { inline: "u" },
                },

                content_style:
                  "p { margin-top: 0; margin-bottom: 0; } a{color:#3598db}",
              }}
            />
          </Grid>
          {/* Categories Section */}
          <Card>
            <CardContent>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Category</Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenCategoryModal}
                >
                  Manage Categories
                </Button>
              </Box>

              {/* Category Select */}
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>

                <Select
                  name="category_id"
                  value={formData?.category_id[0] || ""}
                  label="Category"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>

                  {categories.map((category) => (
                    <MenuItem
                      key={category?.category_id}
                      value={category?.category_id}
                    >
                      {category?.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <CategoryManagementModal
            open={openCategoryModal}
            onClose={handleCloseCategoryModal}
          />

          {/* Author Section */}
          <Card>
            <CardContent>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Author</Typography>
              </Box>

              {/* Author Select */}
              <FormControl fullWidth>
                <InputLabel>Author</InputLabel>

                <Select
                  name="author_id"
                  value={formData?.author_id || ""}
                  label="Author"
                  onChange={handleInputChange}
                >
                  <MenuItem value="">
                    <em>Select Author</em>
                  </MenuItem>

                  {authors.map((author) => (
                    <MenuItem key={author?.author_id} value={author?.author_id}>
                      {author?.author_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          {/* Location Section */}
          <Card sx={{ mb: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Location
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country_id"
                      aria-placeholder="country"
                      value={formData.country_id}
                      onChange={handleInputChange}
                      label="Country"
                      sx={{
                        width: formData.country_id ? "auto" : "7rem",
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Country</em>
                      </MenuItem>
                      {countries &&
                        countries?.map((country: Country) => (
                          <MenuItem key={country?.id} value={country?.id}>
                            {country?.countryName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    disabled={!formData.country_id}
                  >
                    <InputLabel>State</InputLabel>
                    <Select
                      name="state_id"
                      value={formData.state_id}
                      onChange={handleInputChange}
                      label="State"
                      sx={{
                        width: formData.state_id ? "auto" : "7rem",
                      }}
                    >
                      <MenuItem value="">
                        <em>Select State</em>
                      </MenuItem>
                      {states.map((state: State) => (
                        <MenuItem
                          key={state.state_id || state.id}
                          value={state.state_id || state.id}
                        >
                          {state.stateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    disabled={!formData.state_id}
                  >
                    <InputLabel>City</InputLabel>
                    <Select
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      label="City"
                      sx={{
                        width: formData.city_id ? "auto" : "7rem",
                      }}
                    >
                      <MenuItem value="">
                        <em>Select City</em>
                      </MenuItem>
                      {cities.map((city: City) => (
                        <MenuItem
                          key={city.city_id || city.id}
                          value={city.city_id || city.id}
                        >
                          {city.cityName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Visibility & Publishing Section */}
          <Card sx={{ mb: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Visibility & Publishing
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="article_visibility"
                  value={formData.article_visibility}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          {/* SEO & Meta Information Section */}
          <Card sx={{ mb: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                SEO & Meta Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid
                spacing={2}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Grid>
                  <TextField
                    fullWidth
                    label="Meta Title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="Meta title for search engines (50-60 characters)"
                    inputProps={{ maxLength: 60 }}
                    helperText={`${formData.meta_title.length}/60 characters`}
                    variant="outlined"
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Meta Description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="Meta description for search engines (150-160 characters)"
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 160 }}
                    helperText={`${formData.meta_description.length}/160 characters`}
                    variant="outlined"
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Meta Keywords"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleInputChange}
                    placeholder="Comma-separated keywords (e.g., keyword1, keyword2, keyword3)"
                    helperText="Separate keywords with commas"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {/* Form Actions */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              size="large"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Saving...
                </>
              ) : article ? (
                "Update Article"
              ) : (
                "Create Article"
              )}
            </Button>
          </Stack>
        </form>
      </Box>
    </Layout>
  );
};

export default AddArticle;
