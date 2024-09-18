import express from 'express'
import Blog from '../models/Blog.js'
import Auth from '../Auth/Auth.js'

const router = express.Router()


router.get('/', Auth, async (req, res) => {
  try {
    const blogs = await Blog.find()
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' })
  }
})


router.get('/:id', Auth, async (req, res) => {
  const { id } = req.params

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog' })
  }
})


router.put('/:id', Auth, async (req, res) => {
  const { id } = req.params
  const { content, title } = req.body

  try {
    let blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    if (blog.isLocked && blog.lockedBy !== req.user.username) {
      return res.status(403).json({ message: 'Blog is locked by another user' })
    }
    blog.title = title
    blog.content = content
    blog.lastEditedBy = req.user.username
    blog.isLocked = false 
    blog.lockedBy = null
    blog.lockedAt = null
    await blog.save()

    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit blog' })
  }
})


router.post('/:id/lock', Auth, async (req, res) => {
  const { id } = req.params
  console.log(id)

  try {
    let blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    if (blog.isLocked && blog.lockedBy !== req.user.username) {
      return res
        .status(403)
        .json({ message: 'Blog is already locked by another user' })
    }

    blog.isLocked = true
    blog.lockedBy = req.user.username
    blog.lockedAt = Date.now()
    await blog.save()

    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Failed to lock blog' })
  }
})


router.post('/:id/unlock', Auth, async (req, res) => {
  const { id } = req.params;
  console.log(id, "Blog ID");

  try {
    // Fetch the blog by ID
    let blog = await Blog.findById(id);
    console.log(blog, "Fetched blog"); 

  
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

   
    console.log(req.user.username, "Requesting user's username"); 
    // if (blog.lockedBy !== req.user.username) {
    //   console.log(blog.lockedBy,"locked ")
    //   console.log(req.user.username,"locked  by ")
    //   return res.status(403).json({ message: 'You cannot unlock this blog' });
    // }

    
    blog.isLocked = false;
    blog.lockedBy = null;
    blog.lockedAt = null;

   
    try {
     
      await blog.save();
      res.json(blog);
    } catch (saveError) {
      console.log(saveError, "Error saving blog"); // Debug: log the save error
      return res.status(500).json({ message: 'Failed to save blog' });
    }
  } catch (err) {
    console.log(err, "Catch block error"); 
    res.status(500).json({ message: 'Failed to unlock blog' });
  }
});


export default router
