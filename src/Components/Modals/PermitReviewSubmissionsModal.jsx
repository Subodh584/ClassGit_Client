import { useState, useEffect, useRef, use } from "react";
import {
  Calendar,
  ChevronDown,
  Clock,
  X,
  AlertCircle,
  Check,
  Square,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from "axios";

const PermitReviewSubmissionsModal = ({ setShowSubmissionsModal1 }) => {
  const [minDate,setMinDate] = useState(new Date().toISOString().split("T")[0]);
  const [reviewsCanBeSubmitted, setReviewsCanBeSubmitted] = useState([]);
  const [reviewsCannotBeSubmitted, setReviewsCannotBeSubmitted] = useState([]);
  const [exceedingDate, setExceedingDate] = useState();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningReviewId, setWarningReviewId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [assignments, setAssignments] = useState([]);

  // Refs for click outside handling
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/fetch-assignment-options",
          {
            userEmail: localStorage.getItem("Email"),
          }
        );
        console.log(response.data);
        setAssignments(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    const reviewsWithDeadline = reviews
      .filter((review) => review.deadline && review.permitted)
      .map((review) => review.name);

    const reviewsWithoutDeadline = reviews
      .filter((review) => !review.deadline || !review.permitted)
      .map((review) => review.name);

    setReviewsCanBeSubmitted(reviewsWithDeadline);
    setReviewsCannotBeSubmitted(reviewsWithoutDeadline);
  }, [reviews]);

  // Close the modal with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowSubmissionsModal1(false);
    }, 300);
  };

  // Handle click outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Add escape key listener for closing modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // Handle assignment selection
  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setReviews([...assignment.reviews]);
    setIsDropdownOpen(false);

    // Add a subtle animation for the selection
    const reviewsSection = document.getElementById("reviews-section");
    if (reviewsSection) {
      reviewsSection.classList.add("animate-pulse");
      setTimeout(() => {
        reviewsSection.classList.remove("animate-pulse");
      }, 500);
    }
  };

  // Handle deadline change for a review
  const handleDeadlineChange = (reviewId, date) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return { ...review, deadline: date };
      }
      return review;
    });

    setReviews(updatedReviews);

    // Check if the review deadline exceeds the assignment deadline
    if (date && selectedAssignment) {
      const reviewDate = new Date(date);
      const assignmentDate = new Date(selectedAssignment.deadline);

      if (reviewDate > assignmentDate) {
        setShowWarning(true);
        setWarningReviewId(reviewId);
      } else {
        setShowWarning(false);
        setWarningReviewId(null);
      }
    }
  };

  const togglePermission = (reviewId) => {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return { ...review, permitted: !review.permitted };
      }
      return review;
    });
    const getLocalTodayDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    setMinDate(getLocalTodayDate);

    setReviews(updatedReviews);
  };


  const handleConfirmWarning = () => {
    // Here you would implement the logic to extend the assignment deadline
    console.log("Final assignment deadline extended");
    toast("Once updated, Deadline will be extended");
    const maxDate = reviews
      .map((r) => new Date(r.deadline))
      .reduce((latest, curr) => (curr > latest ? curr : latest));
    const formattedMaxDate = maxDate.toISOString().split("T")[0];
    console.log(formattedMaxDate);
    setExceedingDate(formattedMaxDate);

    setShowWarning(false);
    setWarningReviewId(null);
  };

  // Handle warning cancelation
  const handleCancelWarning = () => {
    // Reset the review deadline that caused the warning
    const updatedReviews = [...reviews];
    const reviewIndex = updatedReviews.findIndex(
      (r) => r.id === warningReviewId
    );
    if (reviewIndex !== -1) {
      updatedReviews[reviewIndex].deadline = null;
    }
    setReviews(updatedReviews);
    setShowWarning(false);
    setWarningReviewId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Save the review settings
  const handleSaveSettings = async () => {
    // Only save reviews that have been permitted
    const permittedReviews = reviews.filter((review) => review.permitted);
    console.log("Saving permitted reviews:", permittedReviews);
    // Here you would handle the API call to save the settings
    console.log(selectedAssignment.id);
    console.log(permittedReviews);
    try {
      const response = await axios.post(
        "http://localhost:3000/save-review-settings",
        {
          assId: selectedAssignment.id,
          reviews: permittedReviews,
        }
      );
    } catch (err) {
      console.error(err);
    }
    toast.success("Updated successfully");
    handleClose();
  };

  // Check if the permitted review has deadlines set
  const hasDeadlineSet = reviews.every(
    (review) => !review.permitted || review.deadline
  );

  // If modal is closed, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-opacity-50 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          handleClose();
        }
      }}
    >
    <Toaster position="top-center" reverseOrder={false} />
      {/* Modal Container with Animation */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-2xl mx-4 transition-all transform duration-300 ease-in-out",
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        {/* Modal Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Permit Review Submissions
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content - with max height for scrolling if needed */}
          <div className="px-6 py-8 max-h-[60vh] overflow-y-auto">
            {/* Assignment Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Assignment
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-all duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="block truncate text-gray-700 dark:text-gray-200">
                    {selectedAssignment
                      ? selectedAssignment.title
                      : "Choose an assignment"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-500 transition-transform duration-200",
                      isDropdownOpen ? "transform rotate-180" : ""
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 max-h-60 overflow-auto border border-gray-200 dark:border-gray-600 animate-in fade-in-50 duration-150">
                    {assignments.map((assignment) => (
                      <button
                        key={assignment.id}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-200 transition-colors duration-150"
                        onClick={() => handleAssignmentSelect(assignment)}
                      >
                        {assignment.title}
                      </button>
                    ))}
                  </div>
                )}
                {selectedAssignment && (
                  <>
                  <h4>Once Updated</h4>
                    {reviewsCanBeSubmitted.length > 0 && (
                      <h4 className="text-green-600">
                        Students can submit: {reviewsCanBeSubmitted.join(", ")}
                      </h4>
                    )}
                    {reviewsCannotBeSubmitted.length > 0 && (
                      <h4 className="text-red-600">
                        Students cannot submit:{" "}
                        {reviewsCannotBeSubmitted.join(", ")}
                      </h4>
                    )}
                  </>
                )}

                {!selectedAssignment && (
                  <>
                    <br />
                    <h6 className="text-center text-blue-600 text-sm">
                      This window lets you set deadlines for selected reviews.
                      Once a deadline is set, students can start submitting
                      their work for that review{" "}
                    </h6>
                  </>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            {selectedAssignment && (
              <div className="mb-6" id="reviews-section">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
                    Allow review submissions
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Assignment Deadline:{" "}
                      {exceedingDate
                        ? formatDate(exceedingDate)
                        : formatDate(selectedAssignment.deadline)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md transition-all duration-200 hover:shadow-md",
                        review.permitted
                          ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                      )}
                    >
                      <div className="flex items-center mb-2 sm:mb-0">
                        <button
                          onClick={() => togglePermission(review.id)}
                          className={cn(
                            "mr-3 p-1.5 rounded-md transition-all duration-200 transform hover:scale-105",
                            review.permitted
                              ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          )}
                          aria-label={
                            review.permitted
                              ? "Disable review"
                              : "Enable review"
                          }
                        >
                          {review.permitted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors duration-200",
                            review.permitted
                              ? "text-gray-800 dark:text-gray-200"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {review.name}
                        </span>
                      </div>
                      <div className="flex items-center ml-8 sm:ml-0">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                          {review.deadline
                            ? formatDate(review.deadline.split("T")[0])
                            : "Set deadline"}
                        </span>
                        <div className="relative">
                          <input
                            type="date"
                            min={minDate}
                            className={cn(
                              "text-sm pl-8 border rounded-md py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                              review.permitted
                                ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            )}
                            onChange={(e) =>
                              handleDeadlineChange(review.id, e.target.value)
                            }
                            value={
                              review.deadline
                                ? review.deadline.split("T")[0]
                                : ""
                            }
                            disabled={!review.permitted}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Dialog */}
            {showWarning && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-6 animate-in fade-in-50 duration-150">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Warning: Deadline Extension
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      The review deadline exceeds the final assignment
                      submission deadline. If you proceed, the final assignment
                      deadline will be extended.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={handleConfirmWarning}
                        className="bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Yes, extend deadline
                      </button>
                      <button
                        onClick={handleCancelWarning}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        No, keep original deadline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md mr-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className={cn(
                "px-4 py-2 rounded-md transition-all duration-200",
                !selectedAssignment || !hasDeadlineSet || showWarning
                  ? "bg-blue-300 dark:bg-blue-800/50 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
              )}
              disabled={!selectedAssignment || !hasDeadlineSet || showWarning}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermitReviewSubmissionsModal;
