"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Img = { url: string; sort?: number };

export default function NewProductPage() {
  const r = useRouter();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<Img[]>([{ url: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImage = () => setImages((arr) => [...arr, { url: "" }]);
  const removeImage = (idx: number) => setImages((arr) => arr.filter((_, i) => i !== idx));
  const updateImage = (idx: number, patch: Partial<Img>) =>
    setImages((arr) => arr.map((im, i) => (i === idx ? { ...im, ...patch } : im)));

  const uploadLocal = async (idx: number, file: File | null) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const j = await res.json();
      updateImage(idx, { url: j.url });
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sku, price: Number(price), stock: Number(stock), description, images }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ? JSON.stringify(j.error) : `Failed (${res.status})`);
      }
      const prod = await res.json();
      r.push(`/products/${prod.slug}`);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Create product</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input className="w-full border rounded px-3 py-2" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={stock}
              onChange={(e) => setStock(parseInt(e.target.value || "0"))} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} value={description}
            onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm">Images</label>
            <button className="btn" type="button" onClick={addImage}>Add image</button>
          </div>
          <div className="mt-2 space-y-2">
            {images.map((im, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <input className="col-span-6 border rounded px-3 py-2" placeholder="https://... or will be filled after upload" value={im.url}
                  onChange={(e) => updateImage(idx, { url: e.target.value })} />
                <div className="col-span-3">
                  <label className="block text-xs mb-1">Upload local</label>
                  <input type="file" accept="image/*" onChange={(e) => uploadLocal(idx, e.target.files?.[0] || null)} />
                </div>
                <input type="number" className="col-span-2 border rounded px-3 py-2" placeholder="Sort" value={im.sort ?? idx}
                  onChange={(e) => updateImage(idx, { sort: parseInt(e.target.value || "0") })} />
                <button className="col-span-1 btn-outline" type="button" onClick={() => removeImage(idx)}>X</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn" disabled={loading} onClick={submit}>Create</button>
          <a href="/admin/products" className="btn-ghost">Cancel</a>
        </div>
      </div>
    </div>
  );
}
