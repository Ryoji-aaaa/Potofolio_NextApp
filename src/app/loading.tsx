import React from "react";

const Loading: React.FC = () => {
  return (
    <div>
      <div className="index-loading">Loading</div>
      <p className="index-loadings">
        Loadingの表示のままの場合
        <br />
        Google Chrome{" "}
        <a target="_blank" href="https://www.google.com/intl/ja_jp/chrome/">
          最新版
        </a>
        をご利用ください。
      </p>
    </div>
  );
};

export default Loading;
