"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import Axios from "./http-client-side/Axios";

import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./loading";

export default function Home() {
  /* HOOKS SECTION */
  const [uploadingImageFile, setUploadingImageFile] = useState<File>();
  const [expression, setExpression] = useState<string>("3H - 1 < 5");
  const [processing, process] = useState<boolean>(false);

  useEffect(() => {
    if (uploadingImageFile != null) {
      process(true);
      const formData = new FormData();
      formData.append("image", uploadingImageFile);
      formData.append("test", "test");
      Axios.post("/ai-model/expression-detection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
          setExpression(response.data.result);
          process(false);
        })
        .catch((error) => {
          alert(error);
          process(false);
        });
    }
  }, [uploadingImageFile]);

  /* LOGIC */
  const handleImageUpload = (file_to_upload: File) => {
    if (uploadingImageFile != null) {
      console.log(URL.createObjectURL(uploadingImageFile));
    }
  };

  const getMathematicExpression = () => {
    process(true);
    const formData = new FormData();
    formData.append("expression", expression);
    Axios.post("/ai-model/expression-eval", formData)
      .then((response) => {
        alert("result : " + response.data.result);
        process(false);
      })
      .catch((error) => {
        alert(error);
        process(false);
      });
  };

  return (
    <main>
      <div
        className={styles.main_content}
        onClick={() => {
          document.getElementById("input-file")?.click();
        }}
      >
        <input
          type="file"
          id="input-file"
          accept="image/*"
          onChange={(event) => {
            if (event.target.files) {
              setUploadingImageFile(event.target.files[0]);
            }
          }}
          hidden
        />
        {uploadingImageFile ? (
          <Image
            src={URL.createObjectURL(uploadingImageFile)}
            alt={uploadingImageFile ? uploadingImageFile.name : ""}
            className="img-fluid"
            width={350}
            height={350}
          />
        ) : (
          <>
            <MdCloudUpload color="#1475cf" size={90} />
            <p className="px-4 mt-3" style={{ fontSize: "15px" }}>
              Drag and drop mathematical expression
            </p>
          </>
        )}
      </div>
      <section className="mt-2 px-4 py-3 bg-dark">
        {processing && (
          <div className="d-flex justify-content-center">
            <Loading />
          </div>
        )}
        {!processing && (
          <div className="d-flex justify-content-between align-items-center bg-dark">
            <p className="text-white m-0">Expression : {expression}</p>
            <button
              className="btn btn-outline-primary"
              onClick={getMathematicExpression}
            >
              Solve
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
