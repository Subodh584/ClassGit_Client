import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function Explorer() {
  const [canUnlinkRepo, setCanUnlinkRepo] = useState(true);
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { assId } = location.state || {};
  const userEmail = localStorage.getItem("Email");

  const token = import.meta.env.VITE_TOKEN_KEY;
  const [flag, setFlag] = useState(true);
  const [directoryTree, setDirectoryTree] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [openedFileName, setOpenedFileName] = useState("");
  const [loadingTree, setLoadingTree] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isImageFile, setIsImageFile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (flag) {
      fetchDirectory("");
    }
  }, [flag]);

  // Load theme preference from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("glassgitTheme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  const fetchDirectory = async (path) => {
    try {
      setLoadingTree(true);
      const response1 = await axios.post(
        "http://localhost:3000/get-repo-and-user-name",
        {
          assId: assId,
          userEmail: userEmail,
        }
      );
      const tempUserName = response1.data[0].RepoUserName;
      const tempRepoName = response1.data[0].reponame;
      const response = await axios.get(
        `https://api.github.com/repos/${tempUserName}/${tempRepoName}/contents/${path}`,
        {
          headers: { Authorization: `token ${token}` },
        }
      );
      const items = response.data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        expanded: false,
        children: [],
      }));
      if (path === "") {
        setDirectoryTree(items);
      } else {
        updateTree(path, items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTree(false);
    }
  };

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      toast.success("Welcome " + localStorage.getItem("UserName") + "!");
      hasShownToast.current = true;
    }
  }, []);

  const fetchFileContent = async (path) => {
    try {
      setLoadingFile(true);
      const response1 = await axios.post(
        "http://localhost:3000/get-repo-and-user-name",
        {
          assId: assId,
          userEmail: userEmail,
        }
      );
      const tempUserName = response1.data[0].RepoUserName;
      const tempRepoName = response1.data[0].reponame;
      const response = await axios.get(
        `https://api.github.com/repos/${tempUserName}/${tempRepoName}/contents/${path}`,
        {
          headers: { Authorization: `token ${token}` },
        }
      );

      setCurrentPath(path);
      setOpenedFileName(response.data.name);

      // Check if file is an image based on extension
      const fileExtension = path.split(".").pop().toLowerCase();
      const isImage = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "svg",
        "bmp",
        "webp",
      ].includes(fileExtension);

      if (isImage) {
        // For images, store the raw URL instead of content
        setFileContent(response.data.download_url);
        setIsImageFile(true);
      } else if (response.data.content) {
        // For text files, decode and store content
        const content = atob(response.data.content);
        setFileContent(content);
        setIsImageFile(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFile(false);
    }
  };

  const updateTree = (path, children) => {
    const updateNode = (nodes) =>
      nodes.map((node) => {
        if (node.path === path) {
          return { ...node, expanded: true, children };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });

    setDirectoryTree((prev) => updateNode(prev));
  };

  const handleNodeClick = (node) => {
    if (node.type === "dir") {
      if (!node.expanded) {
        fetchDirectory(node.path);
      } else {
        collapseNode(node.path);
      }
    } else if (node.type === "file") {
      fetchFileContent(node.path);
      // On mobile, close sidebar when file is selected
      if (window.innerWidth <= 768) {
        setSidebarVisible(false);
      }
    }
  };

  const collapseNode = (path) => {
    const collapse = (nodes) =>
      nodes.map((node) => {
        if (node.path === path) {
          return { ...node, expanded: false, children: [] };
        }
        if (node.children.length > 0) {
          return { ...node, children: collapse(node.children) };
        }
        return node;
      });

    setDirectoryTree((prev) => collapse(prev));
  };

  const renderTree = (nodes) =>
    nodes.map((node) => (
      <div
        key={node.path}
        className="tree-node"
        style={{ paddingLeft: "20px" }}
      >
        <div
          className="node-content"
          style={{
            cursor: "pointer",
            fontWeight: node.type === "dir" ? "bold" : "normal",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 4px",
            borderRadius: "4px",
            color: darkMode ? "#e0e0e0" : "#333333",
          }}
          onClick={() => handleNodeClick(node)}
        >
          <span className="node-icon">
            {node.type === "dir" ? (node.expanded ? "📂" : "📁") : "📄"}
          </span>
          <span className="node-name">{node.name}</span>
        </div>
        <div
          className={`node-children ${node.expanded ? "expanded" : ""}`}
          style={{
            height: node.expanded ? "auto" : "0",
            overflow: "hidden",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {node.children.length > 0 && renderTree(node.children)}
        </div>
      </div>
    ));

  const handleDownload = () => {
    const element = document.createElement("a");

    if (isImageFile) {
      // For images, download directly from the URL
      element.href = fileContent;
    } else {
      // For text files, create a blob
      const file = new Blob([fileContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
    }

    element.download = openedFileName || "file";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("glassgitTheme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    // Responsive adjustments
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchIsSubmited = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/is-submited-for-review",
          {
            assId: assId,
            userEmail: userEmail,
          }
        );
        response.data.map((item) => {
          if (item.completetion_status === "Completed") {
            setCanUnlinkRepo(false);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchIsSubmited();
  }, [selectedReviewId]);

  // Get theme-specific styles
  const getThemeStyles = () => {
    if (darkMode) {
      return {
        container: { backgroundColor: "#121212", color: "#e0e0e0" },
        header: { backgroundColor: "#65c9db", color: "#ffffff" },
        sidebar: {
          backgroundColor: "#1e1e1e",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        },
        main: { backgroundColor: "#121212" },
        fileContent: {
          backgroundColor: "#1a1a1a",
          color: "#e0e0e0",
          border: "1px solid #333",
        },
        loading: { color: "#bbbbbb" },
        downloadBtn: { backgroundColor: "#2196f3", color: "white" },
        menuButton: { color: "#ffffff" },
        icon: { color: "#e0e0e0" },
      };
    } else {
      return {
        container: { backgroundColor: "#f5f5f5", color: "#333333" },
        header: { backgroundColor: "#65c9db", color: "#ffffff" },
        sidebar: {
          backgroundColor: "#f0f0f0",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        },
        main: { backgroundColor: "#ffffff" },
        fileContent: {
          backgroundColor: "#ffffff",
          color: "#333333",
          border: "1px solid #e0e0e0",
        },
        loading: { color: "#666666" },
        downloadBtn: { backgroundColor: "#2196f3", color: "white" },
        menuButton: { color: "#ffffff" },
        icon: { color: "#333333" },
      };
    }
  };

  const themeStyles = getThemeStyles();

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleUnlinkRepo = async () => {
    if (canUnlinkRepo) {
      try {
        const response = await axios.post("http://localhost:3000/unlink-repo", {
          assId: assId,
          userEmail: userEmail,
        });
        toast.success("Unlink Successful!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/student-dashboard");
      } catch (err) {
        console.error(err);
        toast.error("Error unlinking repo!");
      }
    } else {
      toast.error(
        "You cannot unlink the repo after submitting the assignment!"
      );
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      const response = await axios.post("http://localhost:3000/fetch-reviews", {
        assId: assId,
        userEmail: userEmail,
      });
      setFetchedReviews(response.data);
      console.log(response.data);
      setLoadingOptions(false);
    } catch (err) {
      console.error(err);
      toast.error("Error Fetching reviews!");
      setLoadingOptions(false);
    }

    setLoadingOptions(false);
    setMenuOpen(false);
    setShowReviewModal(true);
  };

  // Simulate review data
  const reviews = [
    {
      id: "rev1",
      name: "Review 1",
      description: "Initial draft check",
      totalMarks: 10,
    },
    {
      id: "rev2",
      name: "Review 2",
      description: "Final submission review",
      totalMarks: 20,
    },
  ];

  return (
    <div style={{ ...styles.container, ...themeStyles.container }}>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div style={{ ...styles.header, ...themeStyles.header }}>
        <div style={styles.titleContainer}>
          <button
            style={{ ...styles.menuButton, ...themeStyles.menuButton }}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1
            style={{
              ...styles.title,
              color: "#ffffff", // White text for better contrast on blue background
            }}
          >
            GlassGit Explorer
          </h1>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {currentPath && (
            <button
              style={{ ...styles.downloadBtn, ...themeStyles.downloadBtn }}
              onClick={handleDownload}
            >
              Download
            </button>
          )}

          {/* 3-dot menu button */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                ...styles.menuDots,
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: darkMode ? "#fff" : "#333",
                padding: "8px",
              }}
              onClick={handleMenuToggle}
              aria-label="Options"
            >
              ⋮
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "0",
                  background: darkMode ? "#333" : "#fff",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  zIndex: 1000,
                  overflow: "hidden",
                  minWidth: "160px",
                }}
              >
                <button
                  onClick={() => {
                    navigate("/student-dashboard");
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    color: darkMode ? "#eee" : "#333",
                    cursor: "pointer",
                  }}
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    handleUnlinkRepo();
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  Unlink Repository
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    color: darkMode ? "#34A56F" : "#34A56F",
                    cursor: "pointer",
                  }}
                >
                  Submit_Assignment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Sidebar */}
        <div
          style={{
            ...styles.sidebar,
            ...themeStyles.sidebar,
            transform: sidebarVisible ? "translateX(0)" : "translateX(-100%)",
            width: sidebarVisible ? "300px" : "0",
          }}
        >
          <h3
            style={{
              ...styles.sidebarTitle,
              color: darkMode ? "#bbbbbb" : "#666666",
            }}
          >
            Explorer
          </h3>
          {loadingTree ? (
            <div style={{ ...styles.loading, ...themeStyles.loading }}>
              <div
                style={{
                  ...styles.spinner,
                  borderColor: darkMode
                    ? "rgba(150, 150, 150, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                  borderTopColor: darkMode ? "#64b5f6" : "#1976d2",
                }}
              ></div>
              <span>Loading folders...</span>
            </div>
          ) : (
            <div style={styles.treeContainer}>{renderTree(directoryTree)}</div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            ...styles.main,
            ...themeStyles.main,
            marginLeft:
              window.innerWidth <= 768 ? "0" : sidebarVisible ? "300px" : "0",
          }}
        >
          {loadingFile ? (
            <div style={{ ...styles.loading, ...themeStyles.loading }}>
              <div
                style={{
                  ...styles.spinner,
                  borderColor: darkMode
                    ? "rgba(150, 150, 150, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                  borderTopColor: darkMode ? "#64b5f6" : "#1976d2",
                }}
              ></div>
              <span>Loading file...</span>
            </div>
          ) : currentPath ? (
            <div style={styles.fileContainer}>
              <h2
                style={{
                  ...styles.fileTitle,
                  color: darkMode ? "#e0e0e0" : "#333333",
                  borderBottom: darkMode
                    ? "1px solid #333"
                    : "1px solid #e0e0e0",
                }}
              >
                {openedFileName}
              </h2>

              {isImageFile ? (
                <div style={styles.imageContainer}>
                  <img
                    src={fileContent}
                    alt={openedFileName}
                    style={styles.imageContent}
                  />
                </div>
              ) : (
                <pre
                  style={{ ...styles.fileContent, ...themeStyles.fileContent }}
                >
                  {fileContent}
                </pre>
              )}
            </div>
          ) : (
            <div
              style={{
                ...styles.emptyState,
                color: darkMode ? "#999" : "#666",
              }}
            >
              <div style={styles.emptyStateIcon}>📂</div>
              <h2>Select a file to view its content</h2>
              <p>Browse the repository files in the explorer panel</p>
            </div>
          )}
        </div>
      </div>
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: darkMode ? "#222" : "#fff",
              padding: "24px",
              borderRadius: "10px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              color: darkMode ? "#fff" : "#000",
            }}
          >
            <h3>Select review to submit assignment for</h3>
            {fetchedReviews.find(
              (r) => r.configid === parseInt(selectedReviewId)
            )?.completion_status === "Not Completed" && (
              <h5
                style={{ color: "orange", fontSize: "13px", marginBottom: "10px" }}
              >
                ⚠️ Once submitted, you cannot unsubmit the assignment for this
                review. Please confirm carefully.
              </h5>
            )}

            <select
              value={selectedReviewId}
              onChange={(e) => setSelectedReviewId(e.target.value)}
              style={{
                padding: "10px",
                marginTop: "12px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: darkMode ? "#333" : "#fff", // Dark mode background
                color: darkMode ? "#fff" : "#000", // Text color
              }}
            >
              <option value="">-- Select Review --</option>
              {loadingOptions ? (
                <option disabled>Loading...</option>
              ) : (
                fetchedReviews.map((review) => (
                  <option key={review.configid} value={review.configid}>
                    {review.review_number +
                      (review.review_number === 1
                        ? "st review"
                        : review.review_number === 2
                        ? "nd review"
                        : review.review_number === 3
                        ? "rd review"
                        : "th review")}{" "}
                    (Marks: {review.total_marks})
                  </option>
                ))
              )}
            </select>

            {selectedReviewId && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  color: darkMode ? "#bbb" : "#444",
                }}
              >
                {
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.review_description
                }
              </p>
            )}

            {fetchedReviews.find(
              (r) => r.configid === parseInt(selectedReviewId)
            )?.completion_status === "Completed" ? (
              <span
                style={{
                  color: "green",
                  fontSize: "14px",
                  marginTop: "8px",
                  display: "block",
                }}
              >
                {"This review is already completed!"}
              </span>
            ) : (
              fetchedReviews.find(
                (r) => r.configid === parseInt(selectedReviewId)
              )?.review_deadline === null && (
                <span
                  style={{
                    color: "orange",
                    fontSize: "14px",
                    marginTop: "8px",
                    display: "block",
                  }}
                >
                  {"Once the teacher permits you may submit this review."}
                </span>
              )
            )}

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={async () => {
                  if (!selectedReviewId) return;
                  const selectedReview = fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  );
                  setCanUnlinkRepo(false);
                  try {
                    const response = await axios.post(
                      "http://localhost:3000/submited-for-review",
                      {
                        assId: assId,
                        userEmail: userEmail,
                        reviewId: selectedReviewId,
                      }
                    );
                    toast.success("Assignment submitted for review!");
                  } catch (err) {
                    console.error(err);
                    toast.error("Error submitting assignment for review!");
                  }
                  setShowReviewModal(false);
                }}
                disabled={
                  !selectedReviewId ||
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.completion_status === "Completed" ||
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.review_deadline === null
                }
                style={{
                  padding: "10px 16px",
                  backgroundColor:
                  !selectedReviewId ||
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.completion_status === "Completed" ||
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.review_deadline === null 
                      ? "#999"
                      : "#34A56F",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                  !selectedReviewId ||
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.completion_status === "Completed" ||
                  fetchedReviews.find(
                    (r) => r.configid === parseInt(selectedReviewId)
                  )?.review_deadline === null
                      ? "not-allowed"
                      : "pointer",
                  marginRight: "10px",
                }}
              >
                Confirm
              </button>

              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    zIndex: 10,
    height: "60px",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 400,
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
  },
  menuButton: {
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "color 0.3s ease",
  },
  themeToggle: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease",
  },
  content: {
    display: "flex",
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    overflowY: "auto",
    padding: "15px",
    transition:
      "transform 0.3s ease, width 0.3s ease, background-color 0.3s ease",
    zIndex: 5,
  },
  sidebarTitle: {
    margin: "0 0 15px 0",
    fontSize: "18px",
    fontWeight: 500,
    paddingBottom: "10px",
    transition: "color 0.3s ease, border-color 0.3s ease",
  },
  treeContainer: {
    animation: "fadeIn 0.5s ease-in-out",
  },
  main: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    transition: "margin-left 0.3s ease, background-color 0.3s ease",
  },
  fileContainer: {
    animation: "fadeIn 0.5s ease-in-out",
  },
  fileTitle: {
    margin: "0 0 15px 0",
    fontSize: "20px",
    fontWeight: "normal",
    paddingBottom: "10px",
    transition: "color 0.3s ease, border-color 0.3s ease",
  },
  fileContent: {
    padding: "20px",
    borderRadius: "8px",
    flex: 1,
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "14px",
    lineHeight: "1.6",
    fontFamily: "'Source Code Pro', 'Courier New', monospace",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition:
      "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    borderRadius: "8px",
    overflow: "auto",
    //    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  imageContent: {
    maxWidth: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    height: "200px",
    fontSize: "16px",
    transition: "color 0.3s ease",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid rgba(150, 150, 150, 0.2)",
    borderRadius: "50%",
    borderTop: "3px solid #64b5f6",
    animation: "spin 1s linear infinite",
    transition: "border-color 0.3s ease",
  },
  downloadBtn: {
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 200px)",
    gap: "15px",
    textAlign: "center",
    animation: "fadeIn 0.5s ease-in-out",
    transition: "color 0.3s ease",
  },
  emptyStateIcon: {
    fontSize: "60px",
    marginBottom: "20px",
    opacity: "0.7",
  },
};

// Insert CSS animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .tree-node {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .node-content:hover {
      background-color: rgba(127, 127, 127, 0.1);
      transition: background-color 0.2s ease;
    }
    
    .node-children.expanded {
      animation: slideDown 0.3s ease-in-out;
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
      body {
        font-size: 14px;
      }
    }
  `;
  document.head.appendChild(style);
}
