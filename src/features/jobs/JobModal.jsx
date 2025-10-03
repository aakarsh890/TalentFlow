import React, { useEffect, useState } from "react";
import Modal from "../../components/UI/Modal";
import TextField from "../../components/UI/TextField";
import Button from "../../components/UI/Button";
import { useDispatch } from "react-redux";
import { createJob, updateJob } from "./jobsSlice";

const JobModal = ({ onClose, job }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setSlug(job.slug || "");
      setTags((job.tags || []).join(","));
    } else {
      setTitle("");
      setSlug("");
      setTags("");
    }
  }, [job]);

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required");

    const payload = {
      id: job?.id,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/\s+/g, "-"),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (job) {
        await dispatch(updateJob(payload)).unwrap();
      } else {
        await dispatch(createJob(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: 12 }}>{job ? "Edit Job" : "Create Job"}</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};

export default JobModal;
