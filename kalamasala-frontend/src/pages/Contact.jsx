function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <p className="text-gray-700 mb-4">
        Have questions, feedback, or need help with your order? We’d love to
        hear from you!
      </p>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p className="mb-2">
          <span className="font-semibold">Email:</span>{" "}
          support@yourecommerce.com
        </p>
        <p className="mb-2">
          <span className="font-semibold">Phone:</span> +91 98765 43210
        </p>
        <p>
          <span className="font-semibold">Address:</span> 123 Market Street,
          Bengaluru, India
        </p>
      </div>
      <p className="text-gray-700 mt-4">
        Our support team is available Monday to Saturday, 9:00 AM – 6:00 PM IST.
      </p>
    </div>
  );
}

export default Contact;
