import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// create book post
router.post("/", protectRoute, async (req, res) => {
    try {
        const {title, author, caption, description, price, image, category, rating, countInStock} = req.body;
        if(!title || !author || !caption || !description || !price || !image || !category || !rating || !countInStock) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        //upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            resource_type: "image",
            folder: "books"
        });
        const imageUrl = uploadResponse.secure_url;

        //console.log("Image URL saved:", imageUrl);

        const newBook = await Book.create({
            title,
            author,
            caption,
            description,
            price,
            image: imageUrl,
            category,
            rating,
            countInStock,
            user: req.user._id
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.log("Error creating book:", error);
        res.status(500).json({ message: error.message });
    }
});


// pagination => infinite scroll
router.get("/", protectRoute, async (req, res) => {
    // example of request from react native - FE
    // const response = await fetch("http://localhost:5001/api/books?page=3&limit=5");
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find({ user: req.user._id })
        .sort({ createdAt: -1 }) //descending order (latest book post on the top)
        .skip(skip) //salta i primi 5 nella seconda pagina, 10 nella terza e cosi via (salta quelli già fetchati)
        .limit(limit) //5 post alla volta
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments({ user: req.user._id });
        
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    } catch (error) {
        console.log("Error getting all books route", error);
        res.status(500).json({ message: error.message });
    }
});

//get reccommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
        .sort({ createdAt: -1 }); //descending order (latest book post on the top)
        res.json(books);
    } catch (error) {
        console.log("Error getting all books route", error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this book" });
        }

        if (book.image && typeof book.image === "string" && book.image.includes("cloudinary")) {
            try {
                const publicId = `books/${book.image.split('/').pop().split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
                console.log("Image deleted from Cloudinary:", publicId);
            } catch (deletedError) {
                console.error("Error deleting image from Cloudinary:", deletedError);
            }
        }

        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: error.message });
    }
});

//lista immagini da cloudinary (prende solo i /books)
router.get("/images", async (req, res) => {
    try {
        const { resources } = await cloudinary.api.resources({
            type: "upload",
            prefix: "books", // Opzionale: filtra per cartella o prefisso
            resource_type: "image", // Specifica che vuoi solo immagini
        });

        const images = resources.map((resource) => ({
            public_id: resource.public_id,
            url: resource.secure_url,
        }));

        res.status(200).json(images);
    } catch (error) {
        console.error("Error fetching images from Cloudinary:", error);
        res.status(500).json({ message: "Error fetching images" });
    }
});

export default router;