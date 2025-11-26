import express from 'express'
import { authMiddleware, loginUser, logoutController, registerUser } from '../../controllers/auth/auth-controller.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutController)
router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: "authenticated user",
        user
    })
})


export default router;
