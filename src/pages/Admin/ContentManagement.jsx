import { useEffect, useState } from "react";
import ContentForm from "../../components/admin/content/ContentForm";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

function ContentManagement() {
  const [contentTitle, setContentTitle] = useState("");
  const [contentType, setContentType] = useState("story");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedSubTheme, setSelectedSubTheme] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [themes, setThemes] = useState([]);
  const [subThemes, setSubThemes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const themeSnapshot = await getDocs(collection(db, "themes"));
      const themeList = themeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const subThemeSnapshot = await getDocs(collection(db, "subThemes"));
      const subThemeList = subThemeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setThemes(themeList);
      setSubThemes(subThemeList);
    };

    fetchData();
  }, []);
  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
    setSelectedSubTheme("");
  };

  const handleAddTheme = async (themeName) => {
    const docRef = await addDoc(collection(db, "themes"), {
      name: themeName,
      createdAt: serverTimestamp(),
    });
    // console.log("Saved ID:", docRef.id);
    const newTheme = {
      id: docRef.id,
      name: themeName,
    };

    setThemes((prev) => [...prev, newTheme]);
    setSelectedTheme(newTheme.id);
  };

  const handleAddSubTheme = async (subThemeName) => {
    const docRef = await addDoc(collection(db, "subThemes"), {
      name: subThemeName,
      themeId: selectedTheme,
      createdAt: serverTimestamp(),
    });
    // console.log("Saved ID:", docRef.id);
    const newSubTheme = {
      id: docRef.id,
      themeId: selectedTheme,
      name: subThemeName,
    };

    setSubThemes((prev) => [...prev, newSubTheme]);
    setSelectedSubTheme(newSubTheme.id);
  };

  const filteredSubThemes = subThemes.filter(
    (item) => item.themeId === selectedTheme,
  );

  const handleSave = async () => {
    // console.log("SAVE CLICK");
    if (!contentTitle.trim()) {
      alert("Please enter content title");
      return;
    }
    if (!selectedTheme) {
      alert("Please select theme");
      return;
    }
    if (!selectedSubTheme) {
      alert("Please select sub theme");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "contents"), {
        title: contentTitle.trim(),
        type: contentType,
        themeId: selectedTheme,
        subThemeId: selectedSubTheme,
        createdAt: serverTimestamp(),
      });
      // console.log("SAVED TO FIREBASE:", docRef.id);
      //  console.log("Saved Content ID:", docRef.id);
      alert("Content saved successfully");

      setContentTitle("");
      setContentType("story");
      setSelectedTheme("");
      setSelectedSubTheme("");
    } catch (error) {
      console.error("Save content error:", error);
      alert("Cannot save content");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Content Management
      </h1>

      <ContentForm
        contentTitle={contentTitle}
        setContentTitle={setContentTitle}
        contentType={contentType}
        setContentType={setContentType}
        themes={themes}
        subThemes={filteredSubThemes}
        setThemes={setThemes}
        setSubThemes={setSubThemes}
        selectedTheme={selectedTheme}
        selectedSubTheme={selectedSubTheme}
        handleThemeChange={handleThemeChange}
        setSelectedSubTheme={setSelectedSubTheme}
        handleSave={handleSave}
        handleAddTheme={handleAddTheme}
        handleAddSubTheme={handleAddSubTheme}
        contentFile={contentFile}
        setContentFile={setContentFile}
      />
    </div>
  );
}

export default ContentManagement;
