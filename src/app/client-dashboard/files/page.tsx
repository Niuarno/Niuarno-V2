"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Trash2, Loader, FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { ClientDashboardLayout } from "@/components/ClientDashboardLayout";
import type { FileUpload } from "@/types/database";

function FilesContent() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (!session.data?.session?.user?.email) {
          toast.error("Please login first");
          return;
        }

        // Fetch client record
        const { data: client, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("email", session.data.session.user.email)
          .single();

        if (clientError) throw clientError;
        setClientId(client.id);

        // Fetch files
        const { data, error } = await supabase
          .from("file_uploads")
          .select("*")
          .eq("client_id", client.id)
          .order("uploaded_at", { ascending: false });

        if (error) throw error;
        setFiles(data || []);
      } catch (error) {
        console.error("Error loading files:", error);
        toast.error("Failed to load files");
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!clientId) {
      toast.error("Client ID not found");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${clientId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("client-uploads")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { data, error: dbError } = await supabase
        .from("file_uploads")
        .insert([
          {
            client_id: clientId,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            uploaded_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setFiles([data, ...files]);
      toast.success("File uploaded successfully!");
      e.target.value = ""; // Reset input
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from("client-uploads").remove([filePath]);

      // Delete from database
      await supabase.from("file_uploads").delete().eq("id", fileId);

      setFiles(files.filter((f) => f.id !== fileId));
      toast.success("File deleted");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from("client-uploads")
        .download(filePath);

      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-400">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">File Management</h1>
        <p className="text-gray-400">
          Upload and manage project files
        </p>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-8 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 transition-colors"
      >
        <label className="cursor-pointer">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload size={48} className="text-cyan-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Files</h3>
            <p className="text-gray-400 text-sm mb-4">
              Drag and drop your files here or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 50MB (Images, Documents, ZIP, etc.)
            </p>
          </div>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.xlsx,.xls"
          />
        </label>
      </motion.div>

      {/* Files List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6">Uploaded Files</h2>

        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileIcon size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <FileIcon size={24} className="text-cyan-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{file.file_name}</p>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(file.file_size)} •{" "}
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleDownloadFile(file.file_path, file.file_name)
                    }
                    className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={18} className="text-cyan-500" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleDeleteFile(file.id, file.file_path)
                    }
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function FilesPage() {
  return (
    <ClientDashboardLayout>
      <FilesContent />
    </ClientDashboardLayout>
  );
}
