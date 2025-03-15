const mongoose = require("mongoose")

const StaticScheme = new mongoose.Schema(
    {
        url: String,
        filename: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("statics", StaticScheme)