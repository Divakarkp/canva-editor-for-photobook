import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./style.css";

const TEMPLATES = [
  {
    id: "full",
    name: "Full page photo",
    frames: [
      { left: 80, top: 60, width: 840, height: 380 }
    ]
  },
  {
    id: "two-vertical",
    name: "Two vertical photos",
    frames: [
      { left: 60, top: 50, width: 380, height: 380 },
      { left: 560, top: 50, width: 380, height: 380 }
    ]
  },
  {
    id: "three-grid",
    name: "Three grid",
    frames: [
      { left: 60, top: 50, width: 380, height: 180 },
      { left: 560, top: 50, width: 380, height: 180 },
      { left: 60, top: 260, width: 880, height: 170 }
    ]
  },
  {
    id: "two-horizontal",
    name: "Two horizontal photos",
    frames: [
      { left: 80, top: 40, width: 840, height: 190 },
      { left: 80, top: 270, width: 840, height: 190 }
    ]
  },
  {
    id: "left-big-right-small",
    name: "Left big, right small",
    frames: [
      { left: 60, top: 50, width: 520, height: 380 },
      { left: 600, top: 50, width: 320, height: 180 },
      { left: 600, top: 250, width: 320, height: 180 }
    ]
  },
  {
    id: "four-grid",
    name: "Four grid",
    frames: [
      { left: 60, top: 40, width: 420, height: 210 },
      { left: 520, top: 40, width: 420, height: 210 },
      { left: 60, top: 260, width: 420, height: 210 },
      { left: 520, top: 260, width: 420, height: 210 }
    ]
  },
  {
    id: "three-equal-vertical",
    name: "Three equal vertical",
    frames: [
      { left: 40, top: 60, width: 300, height: 380 },
      { left: 350, top: 60, width: 300, height: 380 },
      { left: 660, top: 60, width: 300, height: 380 }
    ]
  },
  {
    id: "strip-bottom",
    name: "Top big, bottom strip",
    frames: [
      { left: 60, top: 40, width: 880, height: 260 },
      { left: 60, top: 320, width: 280, height: 130 },
      { left: 360, top: 320, width: 280, height: 130 },
      { left: 660, top: 320, width: 280, height: 130 }
    ]
  },
  {
    id: "mosaic-five",
    name: "Five photo mosaic",
    frames: [
      { left: 40, top: 40, width: 360, height: 220 },
      { left: 420, top: 40, width: 260, height: 160 },
      { left: 700, top: 40, width: 260, height: 220 },
      { left: 40, top: 280, width: 260, height: 160 },
      { left: 320, top: 250, width: 640, height: 210 }
    ]
  },
  {
    id: "six-grid",
    name: "Six grid (2×3)",
    frames: [
      { left: 60, top: 50, width: 286, height: 195 },
      { left: 356, top: 50, width: 286, height: 195 },
      { left: 652, top: 50, width: 288, height: 195 },
      { left: 60, top: 255, width: 286, height: 195 },
      { left: 356, top: 255, width: 286, height: 195 },
      { left: 652, top: 255, width: 288, height: 195 }
    ]
  },
  {
    id: "nine-grid",
    name: "Nine grid (3×3)",
    frames: [
      { left: 50, top: 45, width: 290, height: 130 },
      { left: 355, top: 45, width: 290, height: 130 },
      { left: 660, top: 45, width: 290, height: 130 },
      { left: 50, top: 185, width: 290, height: 130 },
      { left: 355, top: 185, width: 290, height: 130 },
      { left: 660, top: 185, width: 290, height: 130 },
      { left: 50, top: 325, width: 290, height: 130 },
      { left: 355, top: 325, width: 290, height: 130 },
      { left: 660, top: 325, width: 290, height: 130 }
    ]
  },
  {
    id: "strip-top-three",
    name: "Strip top + big bottom",
    frames: [
      { left: 60, top: 40, width: 280, height: 115 },
      { left: 355, top: 40, width: 290, height: 115 },
      { left: 660, top: 40, width: 280, height: 115 },
      { left: 60, top: 165, width: 880, height: 295 }
    ]
  },
  {
    id: "left-stack-right-big",
    name: "Left stack + main",
    frames: [
      { left: 55, top: 50, width: 250, height: 195 },
      { left: 55, top: 255, width: 250, height: 195 },
      { left: 320, top: 50, width: 625, height: 400 }
    ]
  },
  {
    id: "bento-six",
    name: "Bento box",
    frames: [
      { left: 55, top: 40, width: 435, height: 200 },
      { left: 505, top: 40, width: 440, height: 95 },
      { left: 505, top: 145, width: 440, height: 95 },
      { left: 55, top: 250, width: 210, height: 200 },
      { left: 275, top: 250, width: 335, height: 95 },
      { left: 620, top: 250, width: 325, height: 200 }
    ]
  },
  {
    id: "center-big-four-corners",
    name: "Center + four corners",
    frames: [
      { left: 230, top: 115, width: 540, height: 270 },
      { left: 55, top: 40, width: 155, height: 65 },
      { left: 790, top: 40, width: 155, height: 65 },
      { left: 55, top: 395, width: 155, height: 65 },
      { left: 790, top: 395, width: 155, height: 65 }
    ]
  },
  {
    id: "seven-collage",
    name: "Seven photo collage",
    frames: [
      { left: 55, top: 45, width: 405, height: 410 },
      { left: 475, top: 45, width: 470, height: 85 },
      { left: 475, top: 140, width: 225, height: 125 },
      { left: 715, top: 140, width: 230, height: 125 },
      { left: 475, top: 275, width: 225, height: 125 },
      { left: 715, top: 275, width: 230, height: 125 },
      { left: 475, top: 410, width: 470, height: 45 }
    ]
  },
  {
    id: "masonry-stagger",
    name: "Masonry stagger",
    frames: [
      { left: 55, top: 40, width: 435, height: 175 },
      { left: 505, top: 40, width: 440, height: 175 },
      { left: 55, top: 225, width: 890, height: 105 },
      { left: 55, top: 340, width: 435, height: 115 },
      { left: 505, top: 340, width: 440, height: 115 }
    ]
  },
  {
    id: "six-strips",
    name: "Six horizontal strips",
    frames: [
      { left: 55, top: 35, width: 890, height: 68 },
      { left: 55, top: 113, width: 890, height: 68 },
      { left: 55, top: 191, width: 890, height: 68 },
      { left: 55, top: 269, width: 890, height: 68 },
      { left: 55, top: 347, width: 890, height: 68 },
      { left: 55, top: 425, width: 890, height: 68 }
    ]
  },
  {
    id: "corners-mixed",
    name: "Corners mixed",
    frames: [
      { left: 55, top: 40, width: 455, height: 215 },
      { left: 525, top: 40, width: 420, height: 95 },
      { left: 525, top: 145, width: 420, height: 110 },
      { left: 55, top: 265, width: 455, height: 195 },
      { left: 525, top: 265, width: 420, height: 195 }
    ]
  }
];

function App() {

  const wrapperRef = useRef(null);

  const [pages, setPages] = useState([
    { templateId: TEMPLATES[0].id, images: [], texts: [] }
  ]);
  const [page, setPage] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragState, setDragState] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [textDragState, setTextDragState] = useState(null);
  const [panelMode, setPanelMode] = useState("layouts"); // 'layouts' | 'image' | 'text'
  const [mobilePanelOpen, setMobilePanelOpen] = useState(null); // null | 'upload' | 'layouts' | 'image' | 'text'

  const getTemplateById = (id) =>
    TEMPLATES.find((tpl) => tpl.id === id) || TEMPLATES[0];

  const currentPage = pages[page] || {
    templateId: TEMPLATES[0].id,
    images: [],
    texts: []
  };

  const handleTemplateSelect = (templateId) => {
    setPages((prev) => {
      const next = [...prev];
      const existing = next[page] || {
        templateId,
        images: [],
        texts: []
      };
      next[page] = {
        templateId,
        images: [],
        texts: existing.texts || []
      };
      return next;
    });

    // show only layouts tools when user picks a layout
    setSelectedImage(null);
    setSelectedText(null);
    setPanelMode("layouts");
  };

  const addPage = () => {
    // limit to 30 pages
    if (pages.length >= 30) return;

    const baseTemplateId = currentPage.templateId;
    const nextIndex = Math.min(pages.length, 29);

    setPages((prev) => {
      if (prev.length >= 30) return prev;
      return [
        ...prev,
        { templateId: baseTemplateId, images: [], texts: [] }
      ];
    });
    setPage(nextIndex);

    // when a new page is added, start in layouts mode for that page
    setSelectedImage(null);
    setSelectedText(null);
    setPanelMode("layouts");
  };

  const loadPage = (index) => {
    setPage(index);
    // reset side panel state when switching pages
    setSelectedImage(null);
    setSelectedText(null);
    setPanelMode("layouts");
  };

  const removePage = (index) => {
    // don't allow deleting the last remaining page
    if (pages.length <= 1) return;

    const total = pages.length;

    setPages((prev) => prev.filter((_, i) => i !== index));

    setPage((prev) => {
      if (prev === index) {
        // if we removed the last page, go back one
        if (index === total - 1) {
          return Math.max(0, prev - 1);
        }
        // otherwise, stay on the same index (next page slides into this slot)
        return prev;
      }

      // if current page was after the removed one, shift it left
      if (prev > index) {
        return prev - 1;
      }

      return prev;
    });
  };

  const uploadImage = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setUploadedImages((prev) => [
          ...prev,
          { src: dataUrl, name: file.name }
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleDeleteImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const placeImageIntoLayout = (src, frameIndexOverride) => {
    const template = getTemplateById(currentPage.templateId);
    const frames = template.frames;

    let newImageIndex = -1;

    setPages((prev) => {
      const next = [...prev];
      const pageData = next[page] || {
        templateId: currentPage.templateId,
        images: [],
        texts: []
      };

      const usedIndices = pageData.images.map((img) => img.frameIndex);

      let frameIndex;
      if (typeof frameIndexOverride === "number") {
        frameIndex = frameIndexOverride;
      } else {
        frameIndex = frames.findIndex(
          (_, idx) => !usedIndices.includes(idx)
        );
        if (frameIndex === -1) frameIndex = 0;
      }

      const images = [...pageData.images];
      const existingIndex = images.findIndex(
        (img) => img.frameIndex === frameIndex
      );

      if (existingIndex !== -1) {
        const existingImage = images[existingIndex];
        images[existingIndex] = {
          src,
          frameIndex,
          offsetX: existingImage.offsetX ?? 50,
          offsetY: existingImage.offsetY ?? 50,
          zoom: existingImage.zoom ?? 0
        };
        newImageIndex = existingIndex;
      } else {
        images.push({
          src,
          frameIndex,
          offsetX: 50,
          offsetY: 50,
          zoom: 0
        });
        newImageIndex = images.length - 1;
      }

      next[page] = {
        templateId: currentPage.templateId,
        images,
        texts: pageData.texts || []
      };

      return next;
    });

    if (newImageIndex >= 0) {
      setSelectedImage({
        pageIndex: page,
        imageIndex: newImageIndex
      });
    }
  };

  const exportToPdf = async () => {
    if (!wrapperRef.current || pages.length === 0) return;

    const wrapper = wrapperRef.current;
    const originalPage = page;
    const canvasWidth = 1000;
    const canvasHeight = 500;
    const scale = 1;
    const origWidth = wrapper.style.width;
    const origHeight = wrapper.style.height;
    const origMaxWidth = wrapper.style.maxWidth;
    const origMaxHeight = wrapper.style.maxHeight;

    try {
      wrapper.style.width = `${canvasWidth}px`;
      wrapper.style.height = `${canvasHeight}px`;
      wrapper.style.maxWidth = `${canvasWidth}px`;
      wrapper.style.maxHeight = `${canvasHeight}px`;

      const opts = { backgroundColor: "#ffffff", scale };

      const pxToMm = 25.4 / 96;
      const wMm = canvasWidth * pxToMm;
      const hMm = canvasHeight * pxToMm;

      flushSync(() => setPage(0));
      const firstCanvas = await html2canvas(wrapper, opts);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [wMm, hMm]
      });
      pdf.addImage(
        firstCanvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        wMm,
        hMm
      );

      for (let i = 1; i < pages.length; i++) {
        flushSync(() => setPage(i));
        const nextCanvas = await html2canvas(wrapper, opts);
        pdf.addPage([wMm, hMm], "landscape");
        pdf.addImage(
          nextCanvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          wMm,
          hMm
        );
      }

      pdf.save("photobook.pdf");
    } finally {
      wrapper.style.width = origWidth;
      wrapper.style.height = origHeight;
      wrapper.style.maxWidth = origMaxWidth;
      wrapper.style.maxHeight = origMaxHeight;
      flushSync(() => setPage(originalPage));
    }
  };

  const saveProject = () => {
    const data = {
      version: 1,
      savedAt: new Date().toISOString(),
      pages,
      uploadedImages
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "photobook-project.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImageMouseDown = (event, imageIndex) => {
    event.preventDefault();
    const img = currentPage.images[imageIndex];
    if (!img) return;

    setSelectedImage({
      pageIndex: page,
      imageIndex
    });
    setSelectedText(null);
    setPanelMode("image");

    setDragState({
      pageIndex: page,
      imageIndex,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: img.offsetX ?? 50,
      startOffsetY: img.offsetY ?? 50
    });
  };

  const handleCanvasMouseMove = (event) => {
    // dragging image inside its frame
    if (dragState && dragState.pageIndex === page) {
      const pageData = currentPage;
      const img = pageData.images[dragState.imageIndex];
      if (img) {
        const frames = getTemplateById(pageData.templateId).frames || [];
        const frame = frames[img.frameIndex] || frames[0];
        if (frame) {
          const dx = event.clientX - dragState.startX;
          const dy = event.clientY - dragState.startY;

          // invert direction so dragging right moves image right visually
          const percentX = (-dx / frame.width) * 100;
          const percentY = (-dy / frame.height) * 100;

          let newOffsetX = dragState.startOffsetX + percentX;
          let newOffsetY = dragState.startOffsetY + percentY;

          newOffsetX = Math.max(-50, Math.min(150, newOffsetX));
          newOffsetY = Math.max(-50, Math.min(150, newOffsetY));

          setPages((prev) => {
            const next = [...prev];
            const current = next[page];
            if (!current) return prev;

            const images = [...current.images];
            const existing = images[dragState.imageIndex];
            if (!existing) return prev;

            images[dragState.imageIndex] = {
              ...existing,
              offsetX: newOffsetX,
              offsetY: newOffsetY
            };

            next[page] = {
              ...current,
              images
            };

            return next;
          });
        }
      }
    }

    // dragging text box by its handle
    if (textDragState && textDragState.pageIndex === page) {
      const dx = event.clientX - textDragState.startX;
      const dy = event.clientY - textDragState.startY;

      let newX = textDragState.startLeft + dx;
      let newY = textDragState.startTop + dy;

      // keep text roughly within page bounds (canvas is 1000x500)
      newX = Math.max(0, Math.min(1000 - 80, newX));
      newY = Math.max(0, Math.min(500 - 40, newY));

      setPages((prev) => {
        const next = [...prev];
        const current = next[page];
        if (!current) return prev;

        const texts = [...(current.texts || [])];
        const index = texts.findIndex((t) => t.id === textDragState.textId);
        if (index === -1) return prev;

        texts[index] = {
          ...texts[index],
          x: newX,
          y: newY
        };

        next[page] = {
          ...current,
          texts
        };

        return next;
      });
    }
  };

  const handleCanvasMouseUp = () => {
    if (dragState) {
      setDragState(null);
    }

    if (textDragState) {
      setTextDragState(null);
    }
  };

  const handleCanvasDragOver = (event) => {
    event.preventDefault();
  };

  const handleCanvasDrop = (event) => {
    event.preventDefault();
    const src = event.dataTransfer.getData("text/plain");
    if (!src || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const frames = getTemplateById(currentPage.templateId).frames || [];
    let frameIndex = frames.findIndex(
      (f) =>
        x >= f.left &&
        x <= f.left + f.width &&
        y >= f.top &&
        y <= f.top + f.height
    );

    if (frameIndex === -1) frameIndex = 0;

    placeImageIntoLayout(src, frameIndex);
  };

  const handleZoomChange = (event) => {
    const value = Number(event.target.value);
    if (
      !selectedImage ||
      selectedImage.pageIndex !== page ||
      Number.isNaN(value)
    ) {
      return;
    }

    setPages((prev) => {
      const next = [...prev];
      const current = next[page];
      if (!current) return prev;

      const images = [...current.images];
      const img = images[selectedImage.imageIndex];
      if (!img) return prev;

      images[selectedImage.imageIndex] = {
        ...img,
        zoom: value
      };

      next[page] = {
        ...current,
        images
      };

      return next;
    });
  };

  const addTextBox = () => {
    setPages((prev) => {
      const next = [...prev];
      const pageData = next[page] || {
        templateId: TEMPLATES[0].id,
        images: [],
        texts: []
      };

      const texts = [...(pageData.texts || [])];
      const id = Date.now();

      texts.push({
        id,
        x: 420,
        y: 230,
        width: 220,
        height: 60,
        content: "Add text",
        color: "#111827",
        fontSize: 16,
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      });

      next[page] = {
        ...pageData,
        texts
      };

      return next;
    });
  };

  const handleTextChange = (textId, event) => {
    const newContent = event.currentTarget.textContent || "";
    const width = event.currentTarget.offsetWidth;
    const height = event.currentTarget.offsetHeight;
    setPages((prev) => {
      const next = [...prev];
      const current = next[page];
      if (!current) return prev;

      const texts = [...(current.texts || [])];
      const index = texts.findIndex((t) => t.id === textId);
      if (index === -1) return prev;

      texts[index] = {
        ...texts[index],
        content: newContent,
        width,
        height
      };

      next[page] = {
        ...current,
        texts
      };

      return next;
    });
  };

  const updateTextStyle = (textId, changes) => {
    setPages((prev) => {
      const next = [...prev];
      const current = next[page];
      if (!current) return prev;

      const texts = [...(current.texts || [])];
      const index = texts.findIndex((t) => t.id === textId);
      if (index === -1) return prev;

      texts[index] = {
        ...texts[index],
        ...changes
      };

      next[page] = {
        ...current,
        texts
      };

      return next;
    });
  };

  const removeTextBox = (textId) => {
    setPages((prev) => {
      const next = [...prev];
      const current = next[page];
      if (!current) return prev;

      const texts = (current.texts || []).filter((t) => t.id !== textId);

      next[page] = {
        ...current,
        texts
      };

      return next;
    });
  };

  const handleTextMouseDown = (event, textId) => {
    event.preventDefault();
    event.stopPropagation();

    const text = (currentPage.texts || []).find((t) => t.id === textId);
    if (!text) return;

    setTextDragState({
      pageIndex: page,
      textId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: text.x,
      startTop: text.y
    });

    setSelectedText({
      pageIndex: page,
      textId
    });
    setSelectedImage(null);
    setPanelMode("text");
  };

  const toggleMobilePanel = (panel) => {
    setMobilePanelOpen((prev) => (prev === panel ? null : panel));
    if (panel === "layouts") {
      setPanelMode("layouts");
      setSelectedImage(null);
      setSelectedText(null);
    } else if (panel === "image") {
      setPanelMode("image");
      setSelectedText(null);
    } else if (panel === "text") {
      setPanelMode("text");
      setSelectedImage(null);
    }
  };

  return (
    <div className="editor" data-mobile-panel={mobilePanelOpen || ""}>

      {/* HEADER */}

      <div className="header">

        <div className="logo">
          Photobook Editor
        </div>

        <div className="headerActions">
          <button type="button" onClick={saveProject}>
            Save
          </button>
          <button type="button" onClick={exportToPdf}>
            Export PDF
          </button>
        </div>

      </div>


      {/* MAIN */}

      <div className="main">

        {/* LEFT PANEL */}

        <div className="sidebar">

          <h3>Upload</h3>

          <label className="uploadButton">
            Upload images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={uploadImage}
            />
          </label>

          {uploadedImages.length > 0 && (
            <div className="thumbGrid">
              {uploadedImages.map((file, index) => (
                <button
                  key={index}
                  type="button"
                  className="thumbButton"
                  onClick={() => placeImageIntoLayout(file.src)}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "copy";
                    event.dataTransfer.setData("text/plain", file.src);
                  }}
                >
                  <button
                    type="button"
                    className="thumbDelete"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteImage(index);
                    }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                  <div className="thumbImage">
                    <img
                      src={file.src}
                      alt={`Photo ${index + 1}`}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>


        {/* LAYOUT PREVIEW AREA */}

        <div className="canvasArea">

          <div
            className="canvasWrapper"
            ref={wrapperRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
          >

            {/* photos clipped to frames */}
            {(() => {
              const frames =
                getTemplateById(currentPage.templateId).frames || [];
              return currentPage.images.map((img, idx) => {
                const frame =
                  frames[img.frameIndex] || frames[0];
                if (!frame) return null;
                const isDragging =
                  dragState &&
                  dragState.pageIndex === page &&
                  dragState.imageIndex === idx;
                const zoom = img.zoom ?? 0;
                const sizeFactor = 100 + zoom * 2; // 0 -> 100%, 50 -> 200%
                const leftPct = (frame.left / 1000) * 100;
                const topPct = (frame.top / 500) * 100;
                const widthPct = (frame.width / 1000) * 100;
                const heightPct = (frame.height / 500) * 100;
                return (
                  <div
                    key={idx}
                    className={
                      isDragging ? "canvasImage dragging" : "canvasImage"
                    }
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                      backgroundImage: `url(${img.src})`,
                      backgroundSize: `${sizeFactor}% auto`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: `${img.offsetX ?? 50}% ${img.offsetY ?? 50}%`
                    }}
                    onMouseDown={(event) => handleImageMouseDown(event, idx)}
                  />
                );
              });
            })()}

            {/* text boxes */}
            {(currentPage.texts || []).map((text) => (
              <div
                key={text.id}
                className="canvasText"
                style={{
                  left: `${text.x}px`,
                  top: `${text.y}px`,
                  width: `${text.width || 220}px`,
                  height: `${text.height || 60}px`,
                  color: text.color || "#111827",
                  fontSize: `${text.fontSize || 16}px`,
                  fontFamily:
                    text.fontFamily ||
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              >
                <button
                  type="button"
                  className="textDrag"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleTextMouseDown(event, text.id);
                  }}
                  aria-label="Move text"
                >
                  ⠿
                </button>
                <button
                  type="button"
                  className="textDelete"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTextBox(text.id);
                  }}
                  aria-label="Remove text"
                >
                  ×
                </button>
                <div
                  className="canvasTextContent"
                  contentEditable
                  suppressContentEditableWarning
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedText({
                      pageIndex: page,
                      textId: text.id
                    });
                    setSelectedImage(null);
                    setPanelMode("text");
                  }}
                  onBlur={(event) =>
                    handleTextChange(text.id, event)
                  }
                >
                  {text.content}
                </div>
              </div>
            ))}

            {/* visual safe-area guides */}
            <div className="canvasGuides">
              {getTemplateById(currentPage.templateId).frames.map((frame, idx) => (
                <div
                  key={idx}
                  className="canvasGuide"
                  style={{
                    left: `${(frame.left / 1000) * 100}%`,
                    top: `${(frame.top / 500) * 100}%`,
                    width: `${(frame.width / 1000) * 100}%`,
                    height: `${(frame.height / 500) * 100}%`
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* MODE SWITCH COLUMN */}

        <div className="modeColumn">
          <button
            type="button"
            className={panelMode === "layouts" ? "modeButton active" : "modeButton"}
            onClick={() => {
              setPanelMode("layouts");
              setSelectedImage(null);
              setSelectedText(null);
            }}
            aria-label="Layouts"
          >
            <svg className="modeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>

          <button
            type="button"
            className={panelMode === "image" ? "modeButton active" : "modeButton"}
            onClick={() => {
              setPanelMode("image");
              setSelectedText(null);
            }}
            aria-label="Image"
          >
            <svg className="modeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </button>

          <button
            type="button"
            className={panelMode === "text" ? "modeButton active" : "modeButton"}
            onClick={() => {
              setPanelMode("text");
              setSelectedImage(null);
            }}
            aria-label="Text"
          >
            <svg className="modeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </button>
        </div>

        {/* RIGHT LAYOUT / EDIT PANEL */}

        <div className="layoutsPanel">

          {/* Layouts mode */}
          {panelMode === "layouts" && (
            <>
              <h3>Layouts</h3>

              <div className="layoutsList">
                {TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    className={
                      tpl.id === currentPage.templateId
                        ? "layoutItem active"
                        : "layoutItem"
                    }
                    onClick={() => handleTemplateSelect(tpl.id)}
                  >
                    <div className="layoutThumb">
                      {tpl.frames.map((frame, idx) => (
                        <div
                          key={idx}
                          className="layoutThumbFrame"
                          style={{
                            left: `${(frame.left / 1000) * 100}%`,
                            top: `${(frame.top / 500) * 100}%`,
                            width: `${(frame.width / 1000) * 100}%`,
                            height: `${(frame.height / 500) * 100}%`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Image edit mode */}
          {panelMode === "image" && (
            <div className="editorPanel">
              <h3>Edit image</h3>
              {(() => {
                if (
                  !selectedImage ||
                  selectedImage.pageIndex !== page ||
                  !currentPage.images[selectedImage.imageIndex]
                ) {
                  return <p className="editorHint">Click a photo in the page to edit.</p>;
                }
                const img = currentPage.images[selectedImage.imageIndex];
                const zoomValue = img.zoom ?? 0;
                return (
                  <div className="zoomControl">
                    <label>
                      Zoom
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={zoomValue}
                        onChange={handleZoomChange}
                      />
                    </label>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Text edit mode */}
          {panelMode === "text" && (
            <div className="editorPanel">
              <h3>Edit text</h3>
              <button type="button" className="addTextInPanel" onClick={addTextBox}>
                Add text
              </button>
              {(() => {
                if (
                  !selectedText ||
                  selectedText.pageIndex !== page
                ) {
                  return <p className="editorHint">Click a text box in the page to edit.</p>;
                }

                const text = (currentPage.texts || []).find(
                  (t) => t.id === selectedText.textId
                );

                if (!text) {
                  return <p className="editorHint">Click a text box in the page to edit.</p>;
                }

                const colorValue = text.color || "#111827";
                const fontSizeValue = text.fontSize || 16;
                const fontFamilyValue =
                  text.fontFamily ||
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

                return (
                  <>
                    <div className="textControl">
                      <label>
                        Color
                        <input
                          type="color"
                          value={colorValue}
                          onChange={(event) =>
                            updateTextStyle(selectedText.textId, {
                              color: event.target.value
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="textControl">
                      <label>
                        Font size
                        <input
                          type="range"
                          min="10"
                          max="48"
                          value={fontSizeValue}
                          onChange={(event) =>
                            updateTextStyle(selectedText.textId, {
                              fontSize: Number(event.target.value)
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="textControl">
                      <label>
                        Font
                        <select
                          value={fontFamilyValue}
                          onChange={(event) =>
                            updateTextStyle(selectedText.textId, {
                              fontFamily: event.target.value
                            })
                          }
                        >
                          <option value='system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'>
                            Sans (default)
                          </option>
                          <option value='"Georgia", "Times New Roman", serif'>
                            Serif
                          </option>
                          <option value='"Courier New", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'>
                            Mono
                          </option>
                          <option value='"Dancing Script", "Comic Sans MS", cursive'>
                            Script
                          </option>
                        </select>
                      </label>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* MOBILE: icon bar – only visible in mobile CSS */}
        <div className="mobilePanelBar">
          <button
            type="button"
            className={mobilePanelOpen === "upload" ? "mobilePanelBtn active" : "mobilePanelBtn"}
            onClick={() => toggleMobilePanel("upload")}
            aria-label="Upload"
          >
            <svg className="mobilePanelIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>
          <button
            type="button"
            className={mobilePanelOpen === "layouts" ? "mobilePanelBtn active" : "mobilePanelBtn"}
            onClick={() => toggleMobilePanel("layouts")}
            aria-label="Layouts"
          >
            <svg className="mobilePanelIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className={mobilePanelOpen === "image" ? "mobilePanelBtn active" : "mobilePanelBtn"}
            onClick={() => toggleMobilePanel("image")}
            aria-label="Image"
          >
            <svg className="mobilePanelIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </button>
          <button
            type="button"
            className={mobilePanelOpen === "text" ? "mobilePanelBtn active" : "mobilePanelBtn"}
            onClick={() => toggleMobilePanel("text")}
            aria-label="Text"
          >
            <svg className="mobilePanelIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </button>
        </div>

      </div>


      {/* PAGE BAR */}

      <div className="pages">

        {pages.map((p, i) => (
          <div
            key={i}
            className={page === i ? "page active" : "page"}
            onClick={() => loadPage(i)}
          >
            Page {i + 1}
            {pages.length > 1 && (
              <button
                type="button"
                className="pageDelete"
                onClick={(event) => {
                  event.stopPropagation();
                  removePage(i);
                }}
                aria-label={`Remove page ${i + 1}`}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {pages.length < 30 && (
          <div
            className="page pageAdd"
            onClick={addPage}
            aria-label="Add page"
          >
            +
          </div>
        )}

      </div>

    </div>
  );

}

export default App;