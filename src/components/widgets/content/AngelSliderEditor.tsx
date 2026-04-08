"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AngelCard } from "@/store/slices/contentWidgetsSlice";
import { useState } from "react";

interface Props {
  heading: string;
  cards: AngelCard[];
  onHeadingChange: (heading: string) => void;
  onCardsChange: (cards: AngelCard[]) => void;
  onSave: (heading: string, cards: AngelCard[]) => void;
}

const emptyAngelCard: AngelCard = {
  title: "",
  subtitle: "",
  image: "",
  link: "",
  alt_text: "",
};

export default function AngelSliderEditor({
  heading,
  cards,
  onHeadingChange,
  onCardsChange,
  onSave,
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<AngelCard>(emptyAngelCard);

  const openCreate = () => {
    setEditIndex(null);
    setDraft({ ...emptyAngelCard });
    setEditorOpen(true);
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setDraft({ ...cards[index] });
    setEditorOpen(true);
  };

  const handleFileUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    const updated = [...cards];
    if (editIndex === null) {
      updated.push(draft);
    } else {
      updated[editIndex] = draft;
    }
    onCardsChange(updated);
    onSave(heading, updated);
    setEditorOpen(false);
  };

  return (
    <>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Angel Slider Widget
          </Typography>
          <TextField
            label="Section Heading"
            value={heading}
            onChange={(e) => onHeadingChange(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Stack spacing={1.5}>
            {cards.map((card, index) => (
              <Box
                key={`angel-${index}`}
                sx={{
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 72,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    bgcolor: "#fafafa",
                  }}
                >
                  {card.image ? (
                    <Box
                      component="img"
                      src={card.image}
                      alt={card.alt_text || card.title || "angel image"}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setActiveImage(card.image);
                        setViewerOpen(true);
                      }}
                    />
                  ) : null}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>{card.title || "Untitled"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.alt_text || "-"}
                  </Typography>
                </Box>
                <Stack direction="row">
                  <IconButton
                    onClick={() => {
                      setActiveImage(card.image);
                      setViewerOpen(true);
                    }}
                    disabled={!card.image}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => openEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      const updated = cards.filter((_, i) => i !== index);
                      onCardsChange(updated);
                      onSave(heading, updated);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}>
              Add Slide
            </Button>
            <Button variant="contained" onClick={() => onSave(heading, cards)}>
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth>
        <DialogTitle>{editIndex === null ? "Add Slide" : "Edit Slide"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Subtitle"
              value={draft.subtitle}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Image Alt Text (Required)"
              value={draft.alt_text}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, alt_text: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Link (optional)"
              value={draft.link}
              onChange={(e) => setDraft((prev) => ({ ...prev, link: e.target.value }))}
              fullWidth
            />
            <Button component="label" variant="outlined">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </Button>
            <TextField
              label="Image URL / Base64"
              value={draft.image}
              onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveDraft}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1 }}>
          {activeImage ? (
            <Box
              component="img"
              src={activeImage}
              alt="Preview"
              sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
