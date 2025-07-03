import React, { useState } from 'react';

interface C3FormProps {
  onSubmit: (data: C3FormData) => void;
}

interface C3FormData {
  organizationName: string;
  ein: string;
  missionStatement: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

const C3Form: React.FC<C3FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<C3FormData>({
    organizationName: '',
    ein: '',
    missionStatement: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    contact: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof C3FormData],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
          Organization Name
        </label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="ein" className="block text-sm font-medium text-gray-700">
          EIN (Employer Identification Number)
        </label>
        <input
          type="text"
          id="ein"
          name="ein"
          value={formData.ein}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700">
          Mission Statement
        </label>
        <textarea
          id="missionStatement"
          name="missionStatement"
          value={formData.missionStatement}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        ></textarea>
      </div>

      <fieldset>
        <legend className="text-base font-medium text-gray-900">Organization Address</legend>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
          <div className="sm:col-span-6">
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Street address
            </label>
            <input
              type="text"
              name="address.street"
              id="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="address.city"
              id="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
              State / Province
            </label>
            <input
              type="text"
              name="address.state"
              id="address.state"
              value={formData.address.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700">
              ZIP / Postal code
            </label>
            <input
              type="text"
              name="address.zip"
              id="address.zip"
              value={formData.address.zip}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-base font-medium text-gray-900">Contact Information</legend>
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
          <div className="sm:col-span-6">
            <label htmlFor="contact.name" className="block text-sm font-medium text-gray-700">
              Contact Name
            </label>
            <input
              type="text"
              name="contact.name"
              id="contact.name"
              value={formData.contact.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="contact.email"
              name="contact.email"
              type="email"
              value={formData.contact.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              type="tel"
              name="contact.phone"
              id="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </fieldset>


      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Organization
        </button>
      </div>
    </form>
  );
};

export default C3Form;
