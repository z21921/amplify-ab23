import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { useAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuthenticator();
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
        {/* 图片显示区域 */}
      </div>
    </div>
  );
}

export default App;