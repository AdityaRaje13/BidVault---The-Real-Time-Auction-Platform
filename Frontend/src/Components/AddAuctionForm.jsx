import { useState } from "react";

export default function AddAuctionForm() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        product_image: null,
        starting_bid: "",
        min_increment: "",
        commission: "",
        start_time: "",
        end_time: "",
        isLive: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="max-w-2xl mx-auto p-8 shadow-2xl rounded-xl bg-white space-y-6 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Add Auction</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium">Product Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home</option>
                    </select>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                    <label className="text-gray-700 font-medium cursor-pointer flex flex-col items-center">
                        <span className="mb-2 text-sm">Click to upload or drag and drop</span>
                        <input
                            type="file"
                            name="product_image"
                            onChange={(e) => setFormData({ ...formData, product_image: e.target.files[0] })}
                            className="hidden"
                        />
                        <span className="text-xs text-gray-500">PNG, JPG (Max 2MB)</span>
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Starting Bid</label>
                        <input type="number" name="starting_bid" value={formData.starting_bid} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Current Bid</label>
                        <input type="number" name="starting_bid" value={formData.starting_bid} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Minimum Increment</label>
                        <input type="number" name="min_increment" value={formData.min_increment} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Commission (%)</label>
                        <input type="number" name="commission" value={formData.commission} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Start Time</label>
                        <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">End Time</label>
                        <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <input type="checkbox" name="isLive" checked={formData.isLive} onChange={() => setFormData((prev) => ({ ...prev, isLive: !prev.isLive }))} className="w-5 h-5 text-blue-600" />
                    <label className="text-gray-700 font-medium">Is Live</label>
                </div>
                <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">Submit Auction</button>
            </form>
        </div>
    );
}
