import { useRef, useState } from "react"
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { type User } from '@/types'

export default function IDCard({ user }: { user: User }) {
  const getInitials = useInitials()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const { patch, setData, processing } = useForm({
    portrait: null as File | null,
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setData("portrait", file)

      // For live preview before saving
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    patch(route('profile.portrait.update'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => setPreview(null), // reset preview after successful save
    })
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg rounded-xl">
      <CardContent className="flex flex-col items-center p-6 space-y-4">
        {/* Portrait */}
        <div className="cursor-pointer" onClick={handleAvatarClick}>
            <Avatar className="h-24 w-24 rounded-full border">
            <AvatarImage
                src={user.profile?.portrait || undefined}
                alt={user.name}
            />
            <AvatarFallback className="text-xl">
                {getInitials(user.name)}
            </AvatarFallback>
            </Avatar>
        </div>

        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />

        {preview && (
          <Button onClick={handleSave} disabled={processing} className="mt-2">
            Save Portrait
          </Button>
        )}

        {/* Info */}
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">ID: {user.profile?.unique_id}</p>
        </div>

        <div className="w-full border-t pt-4 text-sm space-y-1">
          <p>
            <span className="font-medium">Age:</span>{' '}
            {user.profile?.age ?? '—'}
          </p>
          <p>
            <span className="font-medium">Personal code:</span>{' '}
            {user.profile?.personal_code ?? '—'}
          </p>
          <p>
            <span className="font-medium">Phone:</span>{' '}
            {user.profile?.phone ?? '—'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
