import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { io } from "socket.io-client"
const socket = io(import.meta.env.VITE_BACKEND_URL, { transports: ['websocket'] });
import { determineUserRole } from "../utils/utils";

export const ListingsContext = createContext();

export const ListingsProvider = ({ children }) => {

  const URL = import.meta.env.VITE_BACKEND_URL;

  axios.defaults.withCredentials = true
  const loginUserId = localStorage.getItem("loginUserId")
  const ownerId = localStorage.getItem("showListing")
  const userRole = determineUserRole(loginUserId, ownerId)

  const navigate = useNavigate()
  const location = useLocation()

  const [listings, setListings] = useState([]);
  const [filteredListing, setFilteredListing] = useState([])
  const [showListing, setShowListing] = useState(null);
  const [ownerName, setOwnerName] = useState("")
  const [editListing, setEditListing] = useState({
    title: '',
    description: '',
    price: '',
    country: '',
    location: ''
  });
  const [newlisting, setNewListing] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    country: '',
    location: ''
  });
  const [reviewPopup, setReviewPopup] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [showListOption, setShowListOption] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [isOtpSubmitted, setisOtpSubmitted] = useState(false);
  const [otp, setOtp] = useState(0);
  const [newPassword, setNewPassword] = useState("")
  const [editProfilePopup, setEditProfilePopup] = useState(false)
  const [previewProfileImg, setPreviewProfileImg] = useState(null)
  const [editProfile, setEditProfile] = useState({ about: "" })
  const [editProfileImg, setEditProfileImg] = useState(null)
  const [noSearchResult, setNoSearchResult] = useState(false)
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState('')
  const [newMessages, setNewMessages] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [currChatId, setCurrChatId] = useState(sessionStorage.getItem("chatID") || null)
  const [guest, setGuest] = useState([])
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const inputRefs = useRef([]);
  const token = localStorage.getItem("token")

  useEffect(() => {
    socket.on("newListing", (listing) => {
      setListings((prevListings) => [...prevListings, listing]);
      setFilteredListing((prevListings) => [...prevListings, listing]);
    });

    socket.on("updateListing", (updatedListing) => {
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === updatedListing._id ? updatedListing : listing
        )
      );
      setFilteredListing((prevListings) =>
        prevListings.map((listing) =>
          listing._id === updatedListing._id ? updatedListing : listing
        )
      );
    });

    socket.on("deleteListing", (deletedListingId) => {
      setListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== deletedListingId)
      );
      setFilteredListing((prevListings) =>
        prevListings.filter((listing) => listing._id !== deletedListingId)
      );
    });

    socket.on("newReview", (newReview) => {
      setShowListing((prevListing) => ({
        ...prevListing,
        reviews: [...(prevListing?.reviews || []), newReview],
      }));
    })

    socket.on("deleteReview", (deletedReviewId) => {
      setShowListing((prevListing) => ({
        ...prevListing,
        reviews: (prevListing?.reviews || []).filter((review) => review._id !== deletedReviewId),
      }));
    })

    socket.on("chatsList", (chatsData) => {
      setChats(chatsData);
    });

    socket.on("newChat", (newChat) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });

    socket.on("deleteChat", (chatId) => {
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));

      if (currChatId === chatId && ownerId && loginUserId !== ownerId) {
        setNewMessages([]);
        navigate("/");
        sessionStorage.clear()
      }

    });

    return () => {
      socket.off("newListing");
      socket.off("updateListing");
      socket.off("deleteListing");
      socket.off("newReview");
      socket.off("deleteReview");
      socket.off("chatsList");
      socket.off("newChat");
      socket.off("deleteChat");

    };
  }, [loginUserId, showListing, currChatId]);

  // fetch all Listings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL + '/listings');
        setListings(response.data)
        setFilteredListing(response.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // search bar feature
  const handleSearchBar = async (query) => {
    if (query.trim() === "") {
      setFilteredListing(listings);
      setNoSearchResult(false)
      return;
    }

    const filtered = listings.filter(listing =>
      listing.country.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      setFilteredListing([])
      setNoSearchResult(true)
    } else {
      setNoSearchResult(false)
    }

    setFilteredListing(filtered);

  }

  // logo click handle
  const handleLogoClick = async () => {
    try {
      const response = await axios.get(URL + `/listings`); // Fetch all listings
      setListings(response.data);
      setFilteredListing(response.data);
    setNoSearchResult(false)
    } catch (error) {
      console.error("Error fetching all listings:", error);
    }
  }

  // create new Listing 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewListing({ ...newlisting, [name]: value })
  }

  const handleFileChange = (e) => {
    setNewListing({ ...newlisting, image: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newlisting.title);
    formData.append('description', newlisting.description);
    formData.append('price', newlisting.price);
    formData.append('country', newlisting.country);
    formData.append('location', newlisting.location);

    if (newlisting.image instanceof File) {
      formData.append('image', newlisting.image);
    }

    try {
      const response = await axios.post(URL + '/listings', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (response.data.success) {
        setNewListing({
          title: "",
          description: "",
          image: null,
          price: "",
          location: "",
          country: ""
        });

        navigate("/");

        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

  // fetch data to show listing
  const fetchListingData = async (id) => {
    try {
      const response = await axios.get(URL + `/listings/${id}/show`);

      if (!response.data.success) {
        toast.error(response.data.message)
        return
      } else {
        setShowListing(response.data.listing)
      }

      localStorage.setItem("showListing", response.data.listing.owner?._id)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // render edit page
  const fetchToEditData = async (id) => {
    try {
      const response = await axios.get(URL + `/listings/${id}/edit`)

      if (response.data.success) {
        setEditListing({
          title: response.data.listing.title,
          description: response.data.listing.description,
          image: response.data.listing.image,
          price: response.data.listing.price,
          location: response.data.listing.location,
          country: response.data.listing.country
        })
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleEditChange = (e) => {
    setEditListing({ ...editListing, [e.target.name]: e.target.value });
  };

  const handleImageEditChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);  // Store the actual file
      setPreviewImg(window.URL.createObjectURL(file)); // Preview image
    }
  };

  // update changes
  const handleUpdateSubmit = async (id) => {
    const formData = new FormData();
    formData.append('title', editListing.title);
    formData.append('description', editListing.description);
    formData.append('price', editListing.price);
    formData.append('country', editListing.country);
    formData.append('location', editListing.location);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      if (!token) {
        localStorage.setItem("from", location.pathname);
        navigate("/login")
        return
      }
      const response = await axios.put(`${URL}/listings/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
      navigate(`/listing/${id}/show`)
    } catch (error) {
      console.log(error);
    }
  };

  // detroy / delete route
  const destroyListing = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this listing?")
    if (!confirmDelete) return

    try {
      if (!token) {
        localStorage.setItem("from", location.pathname);
        navigate("/login")
        return
      }
      const response = await axios.delete(URL + `/listings/${id}`)

      if (response.data.success) {
        toast.success(response.data.message)
        setCurrChatId(null)
        setSelectedChat(null)
        setNewMessages([])
        
        sessionStorage.clear()
        navigate("/")
      } else {
        toast.error(response.data.message)
      }
      console.log("delete listing res", response)
    }

    catch (error) {
      console.log(error)
    }
  }

  // handle submit and handle close in review popup
  const popupIsOpen = () => {
    document.body.classList.add("no-scroll")
    setReviewPopup(true)
  }

  const popupIsClose = () => {
    document.body.classList.remove("no-scroll")
    setReviewPopup(false)
  }

  // add review
  const handleReviewSubmit = async (id) => {
    try {
      if (!token) {
        localStorage.setItem("from", location.pathname);
        navigate("/login")
        return
      }
      const response = await axios.post(URL + `/listings/${id}/reviews`, { feedback }, {
        headers: "Content-Type: application/json"
      })

      if (response.data.success) {
        toast.success(response.data.message)
        setFeedback("");
        popupIsClose()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // delete review
  const deleteReview = async (listingId, reviewId) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this review?")
    if (!confirmDelete) return

    try {
      await axios.delete(URL + `/listings/${listingId}/reviews/${reviewId}`)
      toast.success("Review deleted successfully")
    } catch (error) {
      console.log(error)
    }
  }

  // check user is login or not
  useEffect(() => {
    const getAuthState = async () => {
      try {
        const { data } = await axios.get(URL + "/auth/is-auth", {withCredentials: true});
        if (data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false)
          localStorage.clear()
          sessionStorage.clear()
        }
      } catch (error) {
        console.log(error)
      }
    }

    getAuthState()
  }, [])

  // fetch user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        if (isLoggedIn && token) {
          const response = await axios.get(URL + `/user/data`, { withCredentials: true }, { headers: { Authorization: `Bearer ${token}` } });

          if (response.data.success) {
            setUserData(response.data.userData)
            setIsLoggedIn(true)
          }
          setIsLoggedIn(true)
        }
        
      } catch (error) {
        console.log(error)
      }
    }

    getUserData()
  }, [token, isLoggedIn])

  // logout functionality
  const logout = async () => {
    try {
      const { data } = await axios.post(URL + '/auth/logout');
  
      if (data.success) {
        toast.success(data.message)
        setIsLoggedIn(false)
        setUserData(false)
        setShowListOption(false)
        localStorage.clear()
        sessionStorage.clear()
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // open and close option of profile tab
  const handleCloseListOption = (path) => {
    setShowListOption(false)
    setTimeout(() => {
      navigate(path)
    }
      , 1000)
  }

  // send verifcation otp
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(URL + `/auth/send-verify-otp`);
      if (data.success) {
        toast.success(data.message)
        navigate("/email-verify")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // send reset otp after submitting email
  const onEmailSubmit = async (email) => {
    try {
      const { data } = await axios.post(URL + `/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // submit otp 
  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(""))
    setisOtpSubmitted(true)
  }

  // submit new password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(URL + '/auth/reset-password', { email, otp, newPassword })

      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
        setisOtpSubmitted(false)
        setIsEmailSent(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // handle edit profile page popup
  const handleEditPopupIsOpen = () => {
    if (userData) {
      setEditProfile({ about: userData.about || "" }); // Pre-fill the "about" field
      setPreviewProfileImg(userData.profileImg?.url || null); // Pre-fill the profile image preview
    }
    document.body.classList.add("no-scroll");
    setEditProfilePopup(true);
  };

  const handleEditPopupIsClose = () => {
    document.body.classList.remove("no-scroll")
    setEditProfilePopup(false)
  }

  const handleProfileChanges = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value })
  }

  const handleProfileImgChanges = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfileImg(file)
      setPreviewProfileImg(window.URL.createObjectURL(file))
    }
  }

  // handle edit profile submit
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("about", editProfile.about);
    formData.append("profileImg", editProfileImg)

    try {
      const response = await axios.put(URL + `/user/update-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (response.data.success) {
        toast.success(response.data.message)

        setUserData(prev => ({ ...prev, about: editProfile.about }))
        setUserData(prev => ({ ...prev, profileImg: response.data.updateProfile.profileImg }))
      } else {
        toast.error(response.data.message)
      }

      setEditProfilePopup(false)
      document.body.classList.remove("no-scroll")
    } catch (error) {

    }
  }

  // delete profile
  const handleDeleteProfile = async (e) => {

    const confirmDelete = window.confirm("Are you sure you want to delete your profile?")
    if (!confirmDelete) return

    try {
      const response = await axios.delete(URL + `/user/delete-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      if (response.data.success) {
        setUserData(false)
        toast.success(response.data.message)
        setCurrChatId(null)
        setSelectedChat(null)
        setNewMessages([])

        localStorage.clear()
        sessionStorage.clear()
       
        navigate("/")

        setUserData(null);
        setListings(prev => prev.filter(listing => listing.owner !== loginUserId)); 
        setFilteredListing(prev => prev.filter(listing => listing.owner !== loginUserId));
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currChatId) {
      socket.emit("joinChat", currChatId)
    }

    socket.on("receiveMessage", (newMessages) => {
      setNewMessages((prevMsg) => [...prevMsg, newMessages])
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [currChatId])

  // fetch al chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        if(isLoggedIn && token && userRole === "Host"){
          const response = await axios.get(URL + `/api/chats`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
          })
         
          const chatsRes = response.data.chats
  
          if (!Array.isArray(chatsRes)) {
            return
          }
         
          setChats(chatsRes)
        }

      } catch (error) {
        console.log(error)
      }
    }

      fetchChats()
   
  }, [isLoggedIn, userRole])

  // delete chat
  const deleteChat = async (chatId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?")
    if (!confirmDelete) return

    try {
      const response = await axios.delete(URL + `/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      const deleteChat = response.data.chat

      if (deleteChat && loginUserId == deleteChat.hostId) {
        toast.success(response.data.message)
        setCurrChatId(null)
        setSelectedChat(null)
        setNewMessages([])
        sessionStorage.clear()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateChat = async () => {
    if (!token) {
      localStorage.setItem("from", location.pathname);
      navigate("/login")
      return
    }

    const requestBody = {
      listingId: showListing._id,
      hostId: showListing.owner._id
    }

    try {

      if (showListing.owner._id === loginUserId) {
        navigate(`/chat`)
        return
      }

      const response = await axios.post(URL + `/api/chats`, requestBody, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      let chatId = response.data.chat._id
      setCurrChatId(chatId)
      sessionStorage.setItem("chatID", chatId)

      socket.emit("createChat", response.data.chat);

      navigate(`/chat`)

    } catch (error) {
      console.log(error)
    }

  }

  // handle fetch message
  const fetchMessages = async (chatId) => {
    if (!chatId) return;

    try {
        const response = await axios.get(`${URL}/api/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        if (!response.data.success) {
          
          setNewMessages([])
        } else {
          setNewMessages(response.data.messages);
        } 
      } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (!selectedChat && !currChatId) return;
  
    if (userRole === "Host" && selectedChat) {
      if (ownerId === loginUserId) {
        fetchMessages(selectedChat);
        handleIsCloseSidebar();
      }
  
    } else if (userRole === "Guest" && currChatId) {
        fetchMessages(currChatId);
      
    }
  }, [selectedChat, currChatId, userRole]);
  

  const handleSelectedChatList = (chatId) => {

    if (selectedChat === chatId) {
      setSelectedChat(null);
      setCurrChatId(null);
      setNewMessages([])
      handleIsCloseSidebar()
    } else {
      setSelectedChat(chatId);
      setCurrChatId(chatId);
    }
  };

  // create message
  const sendMessage = async (chatId) => {
    if (!message.trim()) return

    const requestBody = {
      chatId: chatId,
      text: message
    }
    try {
      const response = await axios.post(URL + `/api/messages`, requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      socket.emit("sendMessage", response.data)

      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currChatId) {
      fetchChatDetails(currChatId)
    }else{
      sessionStorage.clear();
      setCurrChatId(null)
    }
  }, [currChatId])


  const fetchChatDetails = async (chatId) => {
    try {
      const response = await axios.get(`${URL}/api/chats/${chatId}/details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setGuest(response.data.chat.guestId);
      setOwnerName(response.data.chat.hostId)
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  // open $ close functionality of chatList-sidebar
  const handleIsOpenSidebar = () => {
    setIsOpenSidebar(true)
  }

  const handleIsCloseSidebar = () => {
    setIsOpenSidebar(false)
  }

  const contextValue = {
    URL,
    showListing, fetchListingData,
    destroyListing, newlisting,
    handleChange, handleFileChange,
    handleSubmit, fetchToEditData,
    editListing, setEditListing,
    popupIsClose, popupIsOpen,
    reviewPopup, handleEditChange,
    handleImageEditChange,
    handleUpdateSubmit,
    previewImg, handleReviewSubmit,
    feedback, setFeedback,
    deleteReview,
    isLoggedIn, setIsLoggedIn,
    userData, setUserData, logout,
    showListOption, setShowListOption,
    handleCloseListOption, sendVerificationOtp,
    email, setEmail, isEmailSent, isOtpSubmitted,
    onEmailSubmit, onSubmitOtp, newPassword,
    setNewPassword,
    onSubmitNewPassword, inputRefs,
    editProfilePopup, handleEditPopupIsClose,
    handleEditPopupIsOpen,
    editProfile, handleEditProfileSubmit, handleProfileChanges,
    handleProfileImgChanges, editProfileImg, handleDeleteProfile,
    previewProfileImg, filteredListing, handleSearchBar, noSearchResult,
    handleLogoClick, handleCreateChat, chats, message, setMessage, sendMessage,
    newMessages, handleSelectedChatList, selectedChat, setSelectedChat, guest, currChatId, ownerName, deleteChat,
    setNewMessages, fetchMessages, handleIsOpenSidebar, handleIsCloseSidebar, isOpenSidebar
  }

  return (
    <ListingsContext.Provider value={contextValue}>
      {children}
    </ListingsContext.Provider>
  );
}