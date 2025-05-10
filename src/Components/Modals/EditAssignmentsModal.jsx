import { useState, useRef, useEffect, use } from "react";
import {
  X,
  ChevronDown,
  Check,
  Square,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Toaster, toast } from "sonner";
import axios from "axios";

export default function EditAssignmentsModal({ setShowEditAssignmentModal1 }) {
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);

  // Sample data - you would get this from your database
  const [assignments, setAssignments] = useState([]);

  // State management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editedAssignment, setEditedAssignment] = useState(null);
  const [initialMin,setInitialMin] = useState(1);

  // Close the dropdown when clicking outside
  useEffect(() => {
    setInitialMin(selectedAssignment?.teamsize || 1);
  },[selectedAssignment]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(()=>{
    const fetchdata = async() =>{
        try {
            const response = await axios.post("http://localhost:3000/get-assignment-details",{
                userEmail:localStorage.getItem("Email"),
            });
            setAssignments(response.data);
        }catch(err){
            console.error(err);
        }
    }
    fetchdata();

  },[]);

  // Handle assignment selection
  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setEditedAssignment(JSON.parse(JSON.stringify(assignment))); // Create a deep copy
    setIsDropdownOpen(false);
    setEditMode(false);
  };

  // Handle close modal
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedAssignment(null);
      setEditedAssignment(null);
      setEditMode(false);
      setShowEditWarning(false);
      setShowDeleteWarning(false);
      setIsClosing(false);
      // You would call a function here to close the modal in your parent component
    }, 300);
    setShowEditAssignmentModal1(false);
  };

  // Enter edit mode
  const handleEditClick = () => {
    setShowEditWarning(true);
  };

  // Confirm edit
  const confirmEdit = () => {
    setEditMode(true);
    setShowEditWarning(false);
  };

  // Cancel edit
  const cancelEdit = () => {
    setShowEditWarning(false);
  };

  // Show delete warning
  const handleDeleteClick = () => {
    setShowDeleteWarning(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    // Filter out the deleted assignment
    const updatedAssignments = assignments.filter(
      (a) => a.id !== selectedAssignment.id
    );
    setAssignments(updatedAssignments);
    toast.success("Assignment deleted successfully");
    handleClose();
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteWarning(false);
  };

  // Save changes
  const saveChanges = async () => {
    console.log("Saving changes:", editedAssignment);
    const updatedAssignments = assignments.map((a) =>
      a.id === editedAssignment.id ? editedAssignment : a
    );

    setAssignments(updatedAssignments);
    setSelectedAssignment(editedAssignment);
    setEditMode(false);

    try {
      const response = await axios.post("http://localhost:3000/update-edited-assignment",{
        "editedAssignment":editedAssignment,
      })
    }catch(err){
      console.error(err);
    }
    toast.success("Assignment updated successfully");
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedAssignment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle review changes
  const handleReviewChange = (reviewId, field, value) => {
    setEditedAssignment((prev) => ({
      ...prev,
      reviews: prev.reviews.map((review) =>
        review.id === reviewId ? { ...review, [field]: value } : review
      ),
    }));
  };

  // Add new review
  const addReview = () => {
    const newReviewId =
      Math.max(...editedAssignment.reviews.map((r) => r.id), 0) + 1;
    const newReview = {
      id: newReviewId,
      name: `Review ${newReviewId}`,
      marks: 10,
      description: "Description for new review",
    };

    setEditedAssignment((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));
  };

  // Remove review
  const removeReview = (reviewId) => {
    setEditedAssignment((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((review) => review.id !== reviewId),
    }));
  };

  // Get total marks
  const getTotalMarks = (reviews) => {
    return reviews.reduce(
      (sum, review) => sum + parseFloat(review.marks || 0),
      0
    );
  };
  

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
          "relative w-full max-w-3xl mx-4 transition-all transform duration-300 ease-in-out",
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      >
        {/* Modal Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {editMode ? "Edit Assignment Details" : "Assignment Details"}
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
          <div className="px-6 py-8 max-h-[70vh] overflow-y-auto">
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
                  disabled={editMode}
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
              </div>
            </div>

            {/* Edit Warning Dialog */}
            {showEditWarning && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6 animate-in fade-in-50 duration-150">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Confirm Edit Mode
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      You are about to edit this assignment. Changes will affect
                      all students assigned to this assignment.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={confirmEdit}
                        className="bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Yes, enter edit mode
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Warning Dialog */}
            {showDeleteWarning && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 animate-in fade-in-50 duration-150">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Warning: Delete Assignment
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      You are about to delete this assignment. This action
                      cannot be undone and will remove all associated data.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={confirmDelete}
                        className="bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Yes, delete assignment
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assignment Details */}
            {selectedAssignment &&
              !editMode &&
              !showEditWarning &&
              !showDeleteWarning && (
                <div className="space-y-6">
                  {/* Basic Assignment Info */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Assignment Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Title
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {selectedAssignment.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Section
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {selectedAssignment.section}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Description
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {selectedAssignment.desc}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Team Size
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {selectedAssignment.teamsize} members
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Reviews
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {selectedAssignment.reviews.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total Marks
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {getTotalMarks(selectedAssignment.reviews)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Reviews
                    </h4>
                    <div className="space-y-3">
                      {selectedAssignment.reviews.map((review, index) => (
                        <div
                          key={review.id}
                          className="bg-white dark:bg-gray-750 p-4 rounded-md border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {index + 1}. {review.name}
                            </h5>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                              {review.marks} marks
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {review.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-800/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Assignment
                    </button>

                    <button
                      onClick={handleEditClick}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Assignment
                    </button>
                  </div>
                </div>
              )}

            {/* Edit Mode */}
            {selectedAssignment && editMode && editedAssignment && (
              <div className="space-y-6">
                {/* Basic Assignment Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Assignment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editedAssignment.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Section
                      </label>
                      <input
                        type="text"
                        value={editedAssignment.section}
                        disabled={true}
                        onChange={(e) =>
                          handleInputChange("section", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editedAssignment.desc}
                        onChange={(e) =>
                          handleInputChange("desc", e.target.value)
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Team Size
                      </label>
                      <input
                        type="number"
                        min={initialMin}
                        value={editedAssignment.teamsize}
                        onChange={(e) =>
                          handleInputChange(
                            "teamsize",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Total Marks
                      </label>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 py-2">
                        {getTotalMarks(editedAssignment.reviews)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Reviews
                    </h4>
                    <button
                      onClick={addReview}
                      className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Review
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedAssignment.reviews.map((review, index) => (
                      <div
                        key={review.id}
                        className="bg-white dark:bg-gray-750 p-4 rounded-md border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium h-5 w-5 flex items-center justify-center rounded-full mr-2">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              value={review.name}
                              onChange={(e) =>
                                handleReviewChange(
                                  review.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              placeholder="Review name"
                            />
                          </div>

                          <div className="flex items-center">
                            <div className="flex items-center mr-3">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                Marks:
                              </label>
                              <input
                                type="number"
                                min={0}
                                 step="any"
                                value={review.marks}
                                onChange={(e) =>
                                  handleReviewChange(
                                    review.id,
                                    "marks",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-16 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                              />
                            </div>

                            <button
                              onClick={() => removeReview(review.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                              disabled={editedAssignment.reviews.length <= 1}
                              title={
                                editedAssignment.reviews.length <= 1
                                  ? "Cannot remove the last review"
                                  : "Remove review"
                              }
                            >
                              <MinusCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Description
                          </label>
                          <textarea
                            value={review.description}
                            onChange={(e) =>
                              handleReviewChange(
                                review.id,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            rows="2"
                            placeholder="Review description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!selectedAssignment && !showEditWarning && !showDeleteWarning && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                <div className="mb-3">
                  <Edit2 className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                  Assignment Editor
                </h4>
                <p className="text-sm">
                  Select an assignment from the dropdown above to view and edit
                  its details.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {selectedAssignment && editMode && (
            <div className="flex justify-end px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditedAssignment(
                    JSON.parse(JSON.stringify(selectedAssignment))
                  );
                }}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md mr-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 rounded-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
