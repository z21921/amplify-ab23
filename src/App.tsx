import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { useAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";

import { ToastContainer, toast } from "react-toastify";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuthenticator();

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }

    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };
  const generateImage = async () => {
    setLoading(true);
    try {
      console.log('Sending request with prompt:', prompt);
      const response = await fetch('https://z94wzq0ef6.execute-api.us-east-1.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify({
          prompt: {
            text: prompt,
            mode: "OUTPAINTING"
          }
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.base64_image) {
        setImage(`data:image/png;base64,${data.base64_image}`);
        toast.success("图片生成成功！");
      } else {
        throw new Error('API返回的数据中没有图像');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error("无法连接到服务器，请检查网络连接");
        } else if (error.message.includes('HTTP error')) {
          toast.error(`服务器错误: ${error.message}`);
        } else {
          toast.error(`错误: ${error.message}`);
        }
      } else {
        toast.error("发生未知错误，请重试");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <div className="header-container">
          <h1 className="main-header">
            文生图利器
            <br />
            <span className="highlight">AB23 AI</span>
          </h1>
          <p className="description">
            简单输入问题， AB23 AI 将会生成图片
          </p>
          
            <button onClick={signOut} className="logout-button">
              退出
            </button>
          
        </div>
        <form onSubmit={onSubmit} className="form-container">
          <div className="search-container">
            <input
              type="text"
              className="wide-input"
              id="ingredients"
              name="ingredients"
              placeholder="问题"
            />
            <button type="submit" className="search-button">
              生成
            </button>
          </div>
        </form>
        <div className="result-container">
          {loading ? (
            <div className="loader-container">
              <p>加载中...</p>
              <Loader size="large" />
              <Placeholder size="large" />
              <Placeholder size="large" />
              <Placeholder size="large" />
            </div>
          ) : (
            result && <p className="result">{result}</p>
          )}
        </div>
      </div>
      
      <div className="right-column">
        <div className="container">
        <h1>Amazon Bedrock Image Generator</h1>
        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt"
            className="input-field"
          />
          <button
            onClick={generateImage}
            className="generate-button"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {image && <img src={image} alt="Generated" className="generated-image" />}
        <ToastContainer />
      </div>
      </div>
    </div>
  );
}

export default App;