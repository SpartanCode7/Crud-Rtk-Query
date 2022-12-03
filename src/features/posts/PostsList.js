import React, { useState } from 'react'
import {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../api/apiSlice'
function PostsList() {
  const [addNewPost, response] = useAddNewPostMutation()
  const [deletePost] = useDeletePostMutation()
  //Set All Fields
  const [inputField, setInputField] = useState({
    id: '',
    name: '',
    description: '',
  })
  //Handler to handle input fields //will impact on onChange
  const inputsHandler = (e) => {
    setInputField((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  //Update 
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation()
  const setPostData = (data) => {
    setInputField({
      id: data.id,
      name: data.name,
      description: data.description,
    })
  }
  
  //Edit Data
  const onEditData = () => {
    updatePost({
      id: inputField.id,
      name: inputField.name,
      description: inputField.description,
    })
    setInputField(() => ({
      id: '',
      name: '',
      description: '',
    }))
  }

  //Submit Data
  const onSubmit = (e) => {
    e.preventDefault()
    const { name, description } = e.target.elements
    setInputField((inputField) => ({
      ...inputField,
      [e.target.name]: e.target.value,
    }))
    let formData = {
      name: name.value,
      description: description.value,
    }
    //Add new
    addNewPost(formData)
      .unwrap()
      .then(() => {
        setInputField(() => ({
          id: '',
          name: '',
          description: '',
        }))
      })
      .then((error) => {
        console.log(error)
      })
  }
  //Get Data
  const {
    data: posts,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetPostsQuery({ refetchOnMountOrArgChange: true })
  let postContent
  if (isGetLoading) {
    postContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  } else if (isGetSuccess) {
    postContent = posts.map((item) => {
      return (
        <div className="col-lg-12 mb-3" key={item.id}>
          <div className="card alert alert-secondary">
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text">{item.description}</p>
              <button
                onClick={() => deletePost(item.id)}
                className="btn btn-outline-danger me-2"
              >
                Remove
              </button>
              <button
                onClick={() => setPostData(item)}
                className="btn btn-outline-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )
    })
  } else if (isGetError) {
    postContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    )
  }
  return (
    <div className="row">
      <div className="col-md-4 offset-md-*">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter Title</strong>
            </label>
            <input
              value={inputField.name}
              type="text"
              className="form-control"
              name="name"
              id="title"
              onChange={inputsHandler}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <strong>Enter content</strong>
            </label>
            <textarea
              value={inputField.description}
              className="form-control"
              rows="3"
              name="description"
              id="body"
              onChange={inputsHandler}
            ></textarea>
          </div>
          <button className="btn btn-danger me-2" type="submit">
            Submit
          </button>
          <button
            onClick={onEditData}
            className="btn btn-primary"
            type="button"
          >
            Update
          </button>
        </form>
      </div>
      <div className="col-lg-8">
        <div className="row">{postContent}</div>
      </div>
    </div>
  )
}
export default PostsList