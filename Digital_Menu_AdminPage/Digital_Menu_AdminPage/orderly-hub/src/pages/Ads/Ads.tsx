// @ts-nocheck
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import "./Ads.css";

const styles = ["special", "discount", "combo", "festival", "premium"];

function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

useEffect(() => {
  const fetchMenu = async () => {
    const res = await fetch("http://localhost:5000/api/menu");
    const result = await res.json();
    setMenuItems(result.data || []);
  };

  fetchMenu();
}, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discount_text: "",
    button_text: "Order Now",
    ad_style: "special",
    start_date: "",
    end_date: "",
    is_active: true,
    menu_item_id: ""
  });

  const [imageFile, setImageFile] = useState(null);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("ads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setAds(data || []);
  };

  useEffect(() => {
    fetchAds();
  }, []);
const uploadImage = async () => {
  if (!imageFile) return { image_url: "", image_path: "" };

  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from("ads-images")
    .upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  console.log("Upload data:", data);
  console.log("Upload error:", error);

  if (error) {
    alert("Storage error: " + error.message);
    throw error;
  }

  const { data: publicData } = supabase.storage
    .from("ads-images")
    .getPublicUrl(filePath);

  return {
    image_url: publicData.publicUrl,
    image_path: filePath,
  };
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const imageData = await uploadImage();

const payload = {
  title: form.title,
  description: form.description,
  discount_text: form.discount_text,
  button_text: form.button_text,
  ad_style: form.ad_style.toLowerCase(),
  is_active: form.is_active,
  start_date: form.start_date || null,
  end_date: form.end_date || null,
  image_url: imageData.image_url || null,
  image_path: imageData.image_path || null,
  menu_item_id: form.menu_item_id || null
};

const { error } = await supabase.from("ads").insert([payload]);

      if (error) throw error;

      setForm({
        title: "",
        description: "",
        discount_text: "",
        button_text: "Order Now",
        ad_style: "special",
        start_date: "",
        end_date: "",
        is_active: true,
      });

      setImageFile(null);
      fetchAds();
      alert("Ad created successfully!");
    } catch (error) {
      console.error("Create ad error:", error);
      alert(error.message || "Failed to create ad");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (ad) => {
    await supabase
      .from("ads")
      .update({ is_active: !ad.is_active })
      .eq("id", ad.id);

    fetchAds();
  };

  const deleteAd = async (ad) => {
    await supabase.from("ads").delete().eq("id", ad.id);

    if (ad.image_path) {
      await supabase.storage.from("ads-images").remove([ad.image_path]);
    }

    fetchAds();
  };

  return (
    <AdminLayout title="Ads & Offers">
      <div className="ads-page">
        <div className="ads-header">
          <div>
            <h2>Create Advertisement</h2>
            <p>Create offers, today specials, combo deals, and festival ads.</p>
          </div>
        </div>

        <div className="ads-grid">
          <form className="ads-form" onSubmit={handleSubmit}>
            <input
              placeholder="Ad Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <input
              placeholder="Discount Text eg: 50% OFF"
              value={form.discount_text}
              onChange={(e) =>
                setForm({ ...form, discount_text: e.target.value })
              }
            />

            <textarea
              placeholder="Short Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              placeholder="Button Text"
              value={form.button_text}
              onChange={(e) =>
                setForm({ ...form, button_text: e.target.value })
              }
            />

            <select
              value={form.ad_style}
              onChange={(e) => setForm({ ...form, ad_style: e.target.value })}
            >
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>

            <div className="ads-date-row">
              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />

              <input
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <label className="ads-check">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              Active Advertisement
            </label>

            <button disabled={loading}>
              {loading ? "Creating..." : "Create Advertisement"}
            </button>
          </form>

          <div className={`ad-preview ${form.ad_style}`}>
            <div className="ad-preview-text">
              <span>{form.discount_text || "50% OFF"}</span>
              <h3>{form.title || "Today Special"}</h3>
              <p>{form.description || "Delicious offer for today only."}</p>
              <button>{form.button_text || "Order Now"}</button>
            </div>

            <div className="ad-preview-img">
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" />
              ) : (
                "🍽️"
              )}
            </div>
          </div>
        </div>

        <h2 className="recent-title">Recent Advertisements</h2>

        <div className="ads-list">
          {ads.map((ad) => (
            <div className={`saved-ad ${ad.ad_style}`} key={ad.id}>
              <div>
                <span>{ad.discount_text}</span>
                <h3>{ad.title}</h3>
                <p>{ad.description}</p>
                <small>
                  {ad.start_date || "No start"} to {ad.end_date || "No end"}
                </small>
              </div>

              {ad.image_url && <img src={ad.image_url} alt={ad.title} />}

              <div className="ad-actions">
                <button onClick={() => toggleActive(ad)}>
                  {ad.is_active ? "Disable" : "Enable"}
                </button>
                <button onClick={() => deleteAd(ad)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Ads;