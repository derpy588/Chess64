<x-mail::message>
# Verify Email

Please verify your email.

<x-mail::button :url="$verifyUrl">
Verify
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
