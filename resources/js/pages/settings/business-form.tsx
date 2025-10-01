import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';

export default function BusinessForm({ business, action }: { business: any; action: string }) {
    return (
        <Form method="post" action={action} options={{ preserveScroll: true }} className="space-y-6">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <input type="hidden" name="business_id" value={business?.id} />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Business Name</Label>
                            <Input id="name" name="name" defaultValue={business?.name} placeholder="Business name" />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" name="industry" defaultValue={business?.industry} placeholder="Industry" />
                            <InputError className="mt-2" message={errors.industry} />
                        </div>

                        <div>
                            <Label htmlFor="email">Business Email</Label>
                            <Input id="email" type="email" name="email" defaultValue={business?.email} placeholder="Contact email" />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="phone">Business Phone</Label>
                            <Input id="phone" name="phone" defaultValue={business?.phone} placeholder="Contact phone" />
                            <InputError className="mt-2" message={errors.phone} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="street_address">Street Address</Label>
                            <Input id="street_address" name="street_address" defaultValue={business?.street_address} placeholder="Street address" />
                            <InputError className="mt-2" message={errors.street_address} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={business?.description} placeholder="Business description" />
                            <InputError className="mt-2" message={errors.description} />
                        </div>

                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" defaultValue={business?.country} placeholder="Country" />
                            <InputError className="mt-2" message={errors.country} />
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" defaultValue={business?.city} placeholder="City" />
                            <InputError className="mt-2" message={errors.city} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing} className="mt-7 w-full">
                            Save Business
                        </Button>
                        <Transition show={recentlySuccessful}>
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </>
            )}
        </Form>
    );
}
